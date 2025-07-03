from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import sqlite3
import hashlib
import jwt
import os
from datetime import datetime, timedelta
import google.generativeai as genai
import json
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="Smart Workplace Assistant API",
    description="AI-powered workplace productivity platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"

# Configure Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')

# Database connection
def get_db_connection():
    conn = sqlite3.connect('data/workplace_assistant.db')
    conn.row_factory = sqlite3.Row
    return conn

# Pydantic models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    due_date: Optional[str] = None
    estimated_hours: float = 1.0

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[str] = None
    estimated_hours: Optional[float] = None

class AIQuery(BaseModel):
    query: str
    context: Optional[str] = None

# Authentication functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# API Routes
@app.get("/")
async def root():
    return {
        "message": "Smart Workplace Assistant API",
        "version": "1.0.0",
        "status": "active"
    }

@app.post("/auth/register")
async def register(user: UserRegister):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user already exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (user.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    password_hash = hashlib.sha256(user.password.encode()).hexdigest()
    
    # Insert user
    cursor.execute('''
        INSERT INTO users (email, password_hash, full_name)
        VALUES (?, ?, ?)
    ''', (user.email, password_hash, user.full_name))
    
    user_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    # Create access token
    access_token = create_access_token({"user_id": user_id, "email": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user.email,
            "full_name": user.full_name
        }
    }

@app.post("/auth/login")
async def login(user: UserLogin):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Find user
    password_hash = hashlib.sha256(user.password.encode()).hexdigest()
    cursor.execute('''
        SELECT id, email, full_name FROM users 
        WHERE email = ? AND password_hash = ? AND is_active = 1
    ''', (user.email, password_hash))
    
    user_data = cursor.fetchone()
    if not user_data:
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Update last login
    cursor.execute('''
        UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?
    ''', (user_data['id'],))
    
    conn.commit()
    conn.close()
    
    # Create access token
    access_token = create_access_token({
        "user_id": user_data['id'],
        "email": user_data['email']
    })
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_data['id'],
            "email": user_data['email'],
            "full_name": user_data['full_name']
        }
    }

@app.get("/tasks")
async def get_tasks(user_id: int = Depends(verify_token)):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC
    ''', (user_id,))
    
    tasks = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return {"tasks": tasks}

@app.post("/tasks")
async def create_task(task: TaskCreate, user_id: int = Depends(verify_token)):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO tasks (user_id, title, description, priority, due_date, estimated_hours)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (user_id, task.title, task.description, task.priority, task.due_date, task.estimated_hours))
    
    task_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return {"message": "Task created successfully", "task_id": task_id}

@app.put("/tasks/{task_id}")
async def update_task(task_id: int, task: TaskUpdate, user_id: int = Depends(verify_token)):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verify task ownership
    cursor.execute("SELECT id FROM tasks WHERE id = ? AND user_id = ?", (task_id, user_id))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Build update query dynamically
    update_fields = []
    values = []
    
    for field, value in task.dict(exclude_unset=True).items():
        if value is not None:
            update_fields.append(f"{field} = ?")
            values.append(value)
    
    if update_fields:
        values.append(task_id)
        values.append(user_id)
        query = f"UPDATE tasks SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?"
        cursor.execute(query, values)
        
        # If task is completed, set completed_at
        if task.status == "completed":
            cursor.execute("UPDATE tasks SET completed_at = CURRENT_TIMESTAMP WHERE id = ?", (task_id,))
    
    conn.commit()
    conn.close()
    
    return {"message": "Task updated successfully"}

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int, user_id: int = Depends(verify_token)):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM tasks WHERE id = ? AND user_id = ?", (task_id, user_id))
    
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")
    
    conn.commit()
    conn.close()
    
    return {"message": "Task deleted successfully"}

@app.get("/analytics")
async def get_analytics(user_id: int = Depends(verify_token)):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get task statistics
    cursor.execute('''
        SELECT 
            COUNT(*) as total_tasks,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
            SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
            AVG(CASE WHEN status = 'completed' THEN actual_hours ELSE NULL END) as avg_completion_time
        FROM tasks WHERE user_id = ?
    ''', (user_id,))
    
    stats = dict(cursor.fetchone())
    
    # Get productivity trends (last 7 days)
    cursor.execute('''
        SELECT 
            DATE(created_at) as date,
            COUNT(*) as tasks_created,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as tasks_completed
        FROM tasks 
        WHERE user_id = ? AND created_at >= date('now', '-7 days')
        GROUP BY DATE(created_at)
        ORDER BY date
    ''', (user_id,))
    
    trends = [dict(row) for row in cursor.fetchall()]
    
    # Calculate productivity score
    completion_rate = (stats['completed_tasks'] / stats['total_tasks'] * 100) if stats['total_tasks'] > 0 else 0
    productivity_score = min(100, completion_rate + (len(trends) * 5))  # Simple scoring algorithm
    
    conn.close()
    
    return {
        "stats": stats,
        "trends": trends,
        "productivity_score": round(productivity_score, 1)
    }

@app.post("/ai/chat")
async def ai_chat(query: AIQuery, user_id: int = Depends(verify_token)):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=503, detail="AI service not configured")
    
    try:
        # Get user context (recent tasks)
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT title, status, priority, due_date FROM tasks 
            WHERE user_id = ? ORDER BY updated_at DESC LIMIT 10
        ''', (user_id,))
        
        recent_tasks = [dict(row) for row in cursor.fetchall()]
        
        # Build context for AI
        context = f"""
        You are a Smart Workplace Assistant helping a user with productivity and task management.
        
        User's recent tasks:
        {json.dumps(recent_tasks, indent=2)}
        
        User query: {query.query}
        
        Provide helpful, actionable advice focused on productivity, task management, and workplace efficiency.
        Keep responses concise and practical.
        """
        
        # Generate AI response
        response = model.generate_content(context)
        ai_response = response.text
        
        # Store interaction
        cursor.execute('''
            INSERT INTO ai_interactions (user_id, query, response)
            VALUES (?, ?, ?)
        ''', (user_id, query.query, ai_response))
        
        conn.commit()
        conn.close()
        
        return {
            "response": ai_response,
            "context_used": len(recent_tasks) > 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@app.get("/ai/insights")
async def get_ai_insights(user_id: int = Depends(verify_token)):
    if not GEMINI_API_KEY:
        return {"insights": ["AI insights require Gemini API configuration"]}
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get comprehensive user data
        cursor.execute('''
            SELECT 
                COUNT(*) as total_tasks,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
                SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) as overdue_tasks,
                AVG(estimated_hours) as avg_estimated_hours
            FROM tasks WHERE user_id = ?
        ''', (user_id,))
        
        user_stats = dict(cursor.fetchone())
        
        # Generate insights
        context = f"""
        Analyze this user's productivity data and provide 3-5 actionable insights:
        
        Statistics:
        - Total tasks: {user_stats['total_tasks']}
        - Completed tasks: {user_stats['completed_tasks']}
        - Completion rate: {(user_stats['completed_tasks']/user_stats['total_tasks']*100) if user_stats['total_tasks'] > 0 else 0:.1f}%
        - Average estimated hours per task: {user_stats['avg_estimated_hours'] or 0:.1f}
        
        Provide specific, actionable insights to improve productivity. Format as a JSON array of strings.
        """
        
        response = model.generate_content(context)
        
        try:
            insights = json.loads(response.text)
        except:
            # Fallback if AI doesn't return valid JSON
            insights = [
                "Focus on completing pending tasks to improve your completion rate",
                "Consider breaking down large tasks into smaller, manageable chunks",
                "Set realistic time estimates based on your historical performance",
                "Prioritize high-impact tasks during your most productive hours"
            ]
        
        conn.close()
        
        return {"insights": insights}
        
    except Exception as e:
        return {"insights": ["Unable to generate insights at this time"]}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
