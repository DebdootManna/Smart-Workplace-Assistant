import sqlite3
import os
from datetime import datetime

def setup_database():
    """Initialize the SQLite database with required tables"""
    
    # Create database directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    # Connect to database
    conn = sqlite3.connect('data/workplace_assistant.db')
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP,
            preferences TEXT DEFAULT '{}',
            is_active BOOLEAN DEFAULT 1
        )
    ''')
    
    # Create tasks table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            priority TEXT DEFAULT 'medium',
            status TEXT DEFAULT 'pending',
            due_date TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP,
            estimated_hours REAL DEFAULT 1.0,
            actual_hours REAL DEFAULT 0.0,
            tags TEXT DEFAULT '[]',
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Create productivity_metrics table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS productivity_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            date DATE NOT NULL,
            tasks_completed INTEGER DEFAULT 0,
            tasks_created INTEGER DEFAULT 0,
            total_work_hours REAL DEFAULT 0.0,
            focus_score REAL DEFAULT 0.0,
            productivity_score REAL DEFAULT 0.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Create ai_interactions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ai_interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            query TEXT NOT NULL,
            response TEXT NOT NULL,
            interaction_type TEXT DEFAULT 'chat',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Create integrations table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS integrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            service_name TEXT NOT NULL,
            service_config TEXT DEFAULT '{}',
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Create indexes for better performance
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_productivity_user_date ON productivity_metrics(user_id, date)')
    
    # Insert demo user if not exists
    cursor.execute('SELECT id FROM users WHERE email = ?', ('demo@example.com',))
    if not cursor.fetchone():
        import hashlib
        password_hash = hashlib.sha256('password123'.encode()).hexdigest()
        cursor.execute('''
            INSERT INTO users (email, password_hash, full_name)
            VALUES (?, ?, ?)
        ''', ('demo@example.com', password_hash, 'Demo User'))
        
        user_id = cursor.lastrowid
        
        # Insert sample tasks for demo user
        sample_tasks = [
            ('Complete project proposal', 'Draft and finalize the Q1 project proposal', 'high', 'in_progress'),
            ('Review team performance', 'Conduct quarterly performance reviews', 'medium', 'pending'),
            ('Update documentation', 'Update API documentation for new features', 'low', 'completed'),
            ('Client meeting preparation', 'Prepare slides for client presentation', 'high', 'pending'),
            ('Code review', 'Review pull requests from team members', 'medium', 'in_progress')
        ]
        
        for title, desc, priority, status in sample_tasks:
            cursor.execute('''
                INSERT INTO tasks (user_id, title, description, priority, status)
                VALUES (?, ?, ?, ?, ?)
            ''', (user_id, title, desc, priority, status))
    
    conn.commit()
    conn.close()
    print("Database setup completed successfully!")

if __name__ == "__main__":
    setup_database()
