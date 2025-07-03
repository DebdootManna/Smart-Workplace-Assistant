# Smart Workplace Assistant

A comprehensive AI-powered workplace productivity platform that combines task management, intelligent assistance, and analytics to enhance team collaboration and individual productivity.

## 🚀 Features

### Core Functionality
- **Task Management** - Create, organize, and track tasks with priority levels and deadlines
- **AI Assistant** - Get intelligent recommendations and automated workflow suggestions
- **Analytics Dashboard** - Track productivity metrics and team performance insights
- **User Authentication** - Secure login and user management system
- **Real-time Updates** - Live synchronization across all connected devices

### Advanced Features
- **Smart Scheduling** - AI-powered task prioritization and time management
- **Team Collaboration** - Share tasks and collaborate with team members
- **Progress Tracking** - Visual progress indicators and completion statistics
- **Productivity Insights** - Detailed analytics on work patterns and efficiency

## 🏗️ Architecture

### Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks and context
- **Authentication**: JWT-based authentication
- **Deployment**: Vercel

### Backend (Python/FastAPI)
- **Framework**: FastAPI with async support
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT tokens with bcrypt hashing
- **API**: RESTful API with automatic OpenAPI documentation
- **Deployment**: Render

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React Icons

### Backend
- Python 3.11
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- JWT Authentication
- bcrypt

### Development Tools
- ESLint
- Prettier
- PostCSS
- Docker

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- Python 3.11+
- Git

### Frontend Setup
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

### Backend Setup
\`\`\`bash
# Install Python dependencies
pip install -r requirements.txt

# Initialize database
python scripts/setup_database.py

# Start the server
python app.py
\`\`\`

### Docker Setup
\`\`\`bash
# Build and run with Docker
docker build -t smart-workplace-assistant .
docker run -p 8000:8000 smart-workplace-assistant
\`\`\`

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
3. Deploy automatically on push to main branch

### Backend (Render)
1. Connect your GitHub repository to Render
2. Use the provided `render.yaml` configuration
3. Set environment variables as needed
4. Deploy automatically on push to main branch

## 📁 Project Structure

\`\`\`
smart-workplace-assistant/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   └── services/        # API services
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Python FastAPI backend
│   ├── app.py              # Main application
│   ├── scripts/            # Database setup scripts
│   └── requirements.txt
├── components/             # Shared UI components
├── public/                # Static assets
├── Dockerfile             # Docker configuration
├── render.yaml           # Render deployment config
└── README.md
\`\`\`

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000
\`\`\`

#### Backend (.env)
\`\`\`env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./workplace_assistant.db
\`\`\`

## 📊 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `GET /tasks` - Retrieve user tasks
- `POST /tasks` - Create new task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in `/docs`
- Review the API documentation at `/docs` endpoint

## 🔮 Roadmap

- [ ] Google Calendar Integration
- [ ] Real-time Notifications
- [ ] Team Collaboration Features
- [ ] Voice Commands
- [ ] Mobile App
- [ ] Advanced Analytics
- [ ] Third-party Integrations
- [ ] Automated Workflows

---

Built with ❤️ using Next.js, FastAPI, and modern web technologies.
