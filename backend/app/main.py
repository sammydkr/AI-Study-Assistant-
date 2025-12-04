from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from typing import List, Optional
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from datetime import datetime

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AI Study Assistant API",
    description="API for AI-powered study recommendations and quiz generation",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 for authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Data Models
class StudyMaterial(BaseModel):
    id: str
    title: str
    content: str
    category: str
    difficulty: str
    created_at: datetime

class QuizRequest(BaseModel):
    topic: str
    difficulty: str = "medium"
    question_count: int = 5
    study_materials: Optional[List[str]] = None

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
    explanation: str

class RecommendationRequest(BaseModel):
    user_id: str
    recent_topics: List[str]
    performance_scores: List[float]

# AI Services
class AIService:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
    
    async def generate_quiz(self, request: QuizRequest) -> List[QuizQuestion]:
        """Generate quiz questions using OpenAI"""
        import openai
        
        client = openai.OpenAI(api_key=self.openai_api_key)
        
        prompt = f"""
        Generate {request.question_count} {request.difficulty} difficulty quiz questions about {request.topic}.
        Each question should have:
        1. A clear question
        2. 4 multiple choice options (A, B, C, D)
        3. The correct answer letter
        4. A brief explanation
        
        Format as JSON.
        """
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful study assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            
            # Parse response (simplified - in real app you'd parse JSON)
            questions = []
            content = response.choices[0].message.content
            
            # Simple parsing for demo
            lines = content.split('\n')
            for i in range(0, len(lines), 6):
                if i + 5 < len(lines):
                    question = QuizQuestion(
                        question=lines[i].replace("Q:", "").strip(),
                        options=[
                            lines[i+1].strip(),
                            lines[i+2].strip(),
                            lines[i+3].strip(),
                            lines[i+4].strip()
                        ],
                        correct_answer=lines[i+5].split(":")[1].strip(),
                        explanation="Explanation would be here"
                    )
                    questions.append(question)
            
            return questions[:request.question_count]
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

class RecommendationEngine:
    def __init__(self):
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
        import numpy as np
        
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.user_profiles = {}
    
    def generate_recommendations(self, request: RecommendationRequest):
        """Generate personalized study recommendations"""
        # Simple recommendation logic - in real app, use ML model
        topics = request.recent_topics
        scores = request.performance_scores
        
        # Calculate weak areas (topics with lowest scores)
        weak_topics = []
        for topic, score in zip(topics, scores):
            if score < 0.7:  # 70% threshold
                weak_topics.append(topic)
        
        recommendations = {
            "focus_areas": weak_topics[:3],
            "suggested_materials": [
                f"Review {topic} practice problems" for topic in weak_topics[:2]
            ],
            "study_plan": f"Spend 30 minutes on {', '.join(weak_topics[:2])} daily",
            "confidence_score": 0.85
        }
        
        return recommendations

# Initialize services
ai_service = AIService()
recommendation_engine = RecommendationEngine()

# API Endpoints
@app.get("/")
async def root():
    return {"message": "AI Study Assistant API", "status": "running", "version": "1.0.0"}

@app.post("/api/quiz/generate", response_model=List[QuizQuestion])
async def generate_quiz(request: QuizRequest, token: str = Depends(oauth2_scheme)):
    """Generate AI-powered quiz questions"""
    questions = await ai_service.generate_quiz(request)
    return questions

@app.post("/api/recommendations")
async def get_recommendations(request: RecommendationRequest, token: str = Depends(oauth2_scheme)):
    """Get personalized study recommendations"""
    recommendations = recommendation_engine.generate_recommendations(request)
    return recommendations

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "ai_service": "operational",
            "recommendation_engine": "operational"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
