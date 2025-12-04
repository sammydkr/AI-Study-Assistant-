
AI-Powered Study Assistant project

# AI Study Assistant 🧠📚

An intelligent study companion that generates personalized quizzes, provides recommendations, and tracks learning progress using AI.

## ✨ Features

- **AI Quiz Generator**: Create custom quizzes on any topic using OpenAI
- **Personalized Recommendations**: ML-powered study suggestions based on performance
- **Progress Dashboard**: Visualize study habits and improvement
- **Full-Stack Application**: Modern React frontend + FastAPI backend
- **DevOps Ready**: Docker, CI/CD, and cloud deployment ready

## 🛠️ Tech Stack

### **Frontend**
- React 18 + TypeScript
- Tailwind CSS
- Chart.js for visualizations
- Axios for API calls

### **Backend**
- FastAPI (Python)
- PostgreSQL + SQLAlchemy
- Redis for caching
- OpenAI API integration
- Scikit-learn for recommendations

### **DevOps**
- Docker & Docker Compose
- GitHub Actions CI/CD
- PostgreSQL + Redis containers
- Automated testing with pytest

## 🚀 Quick Start

### **Method 1: Docker (Recommended)**
```bash
# Clone the repository
git clone https://github.com/yourusername/ai-study-assistant.git
cd ai-study-assistant

# Copy environment variables
cp .env.example .env
# Edit .env with your OpenAI API key

# Start all services
docker-compose up --build
