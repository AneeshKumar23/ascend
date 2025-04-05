from pydantic import BaseModel, EmailStr
from typing import List, Dict


class Habit(BaseModel):
    title: str
    time: str
    priority: str
    reminder: bool = False
    streak: int = 0

class Goal(BaseModel):
    title: str
    deadline: str
    milestones: Dict[str, List[str]]
    xp: int = 100  
    priority: str = "medium"  
    progress: int = 0  


class PromptRequest(BaseModel):
    prompt: str


class StreakUpdate(BaseModel):
    completed: bool


class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str  
    avatar: str



class LoginRequest(BaseModel):
    email: str
    password: str