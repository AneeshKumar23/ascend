import os
import logging
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Dict
import uvicorn
import google.generativeai as genai

# Suppress gRPC and absl warnings
os.environ['GRPC_VERBOSITY'] = 'ERROR'
os.environ['GRPC_LOG_SEVERITY_LEVEL'] = 'ERROR'
logging.getLogger('absl').setLevel(logging.ERROR)

# Configure Gemini API
genai.configure(api_key='AIzaSyD-oT3hh0IsFrkFDrkxllT81mrDRyByFBY')
model = genai.GenerativeModel('gemini-2.0-flash')

app = FastAPI()

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# File Paths
HABITS_FILE = "habits.json"
USERS_FILE = "users.json"

# Ensure JSON files exist
for file_path in [HABITS_FILE, USERS_FILE]:
    if not os.path.exists(file_path):
        with open(file_path, "w") as file:
            json.dump([] if file_path == HABITS_FILE else {}, file)

# Utility Functions
def load_data(file_path):
    try:
        with open(file_path, "r") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return [] if file_path == HABITS_FILE else {}

def save_data(file_path, data):
    with open(file_path, "w") as file:
        json.dump(data, file, indent=4)

# Models
class Habit(BaseModel):
    title: str
    time: str
    priority: str
    reminder: bool = False
    streak: int = 0

class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str  # No hashing (security risk)
    avatar: str

class LoginRequest(BaseModel):
    email: str
    password: str
    
    
class PromptRequest(BaseModel):
    prompt: str

# Habit Endpoints
@app.get("/habits")
def get_habits():
    return load_data(HABITS_FILE)

@app.post("/habits")
def add_habit(habit: Habit):
    habits = load_data(HABITS_FILE)
    new_habit = { "id": len(habits) + 1, **habit.dict() }
    habits.append(new_habit)
    save_data(HABITS_FILE, habits)
    return {"message": "Habit added successfully", "habit": new_habit}

@app.put("/habits/{habit_id}")
def update_habit(habit_id: int, habit: Habit):
    habits = load_data(HABITS_FILE)
    for h in habits:
        if h["id"] == habit_id:
            h.update(habit.dict())
            save_data(HABITS_FILE, habits)
            return {"message": "Habit updated successfully", "habit": h}
    raise HTTPException(status_code=404, detail="Habit not found")

@app.delete("/habits/{habit_id}")
def delete_habit(habit_id: int):
    habits = load_data(HABITS_FILE)
    updated_habits = [h for h in habits if h["id"] != habit_id]
    if len(updated_habits) == len(habits):
        raise HTTPException(status_code=404, detail="Habit not found")
    save_data(HABITS_FILE, updated_habits)
    return {"message": "Habit deleted successfully"}

@app.patch("/habits/{habit_id}/streak")
def update_streak(habit_id: int, completed: bool):
    habits = load_data(HABITS_FILE)
    for habit in habits:
        if habit["id"] == habit_id:
            habit["streak"] += 1 if completed else max(0, habit["streak"] - 1)
            save_data(HABITS_FILE, habits)
            return {"message": "Streak updated", "habit": habit}
    raise HTTPException(status_code=404, detail="Habit not found")

# User Endpoints
@app.post("/register")
def register(user: UserSignup):
    users = load_data(USERS_FILE)
    if user.email in users:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_data = {
        "id": str(len(users) + 1),
        "username": user.username,
        "email": user.email,
        "password": user.password,  
        "avatar": user.avatar,
        "dateJoined": "2025-02-07",
        "preferences": {"notifications": True, "theme": "dark"}
    }

    users[user.email] = user_data
    save_data(USERS_FILE, users)
    return {"message": "Registration successful", "user": user_data}

@app.post("/login")
def login(request: LoginRequest):
    users = load_data(USERS_FILE)
    for user in users.values():
        if user["email"] == request.email and user["password"] == request.password:
            return {k: user[k] for k in ["id", "username", "email", "avatar", "dateJoined", "preferences"]}
    raise HTTPException(status_code=401, detail="Invalid email or password")

# Gemini API for Habit Recommendations
@app.post("/recommend_habits")
def recommend_habits(request: PromptRequest):
    prompt = request.prompt
    base = """{
        type: 'bot',
        content: "Here's a suggested goal for connecting to the Gemini API with Python:\\n\\nConnect to the Gemini API with Python\\n\\nMilestones:\\n1. Set up a Google Cloud Project and enable the Gemini API.\\n2. Install the necessary Python libraries (google-generativeai).\\n3. Obtain API credentials (API key or service account).\\n4. Write a basic Python script to authenticate and make a simple request to the Gemini API.\\n5. Explore different API endpoints and parameters.\\n6. Implement error handling and logging in your Python code.\\n\\nWould you like to use this goal?",
        suggestion: {
            title: "Connect to the Gemini API with Python",
            deadline: "2024-08-01",
            milestones: {
                "Set up a Google Cloud Project and enable the Gemini API.": [],
                "Install the necessary Python libraries (google-generativeai).": [],
                "Obtain API credentials (API key or service account).": [],
                "Write a basic Python script to authenticate and make a simple request to the Gemini API.": [],
                "Explore different API endpoints and parameters.": [],
                "Implement error handling and logging in your Python code.": []
            }
        }
    }

    I want the output you generate to be in the above structure format. Strictly follow the template and don't change the structure. Provide only 6 milestones. Do not mention the output format like JSON or Python. Generate 2 subtopics for each milestone and place them in their list."""

    try:
        response = model.generate_content(base + prompt).text
        data = json.loads(response[7:-4].strip())
        return data['suggestion']['milestones']
    except (json.JSONDecodeError, KeyError) as e:
        raise HTTPException(status_code=500, detail=f"Error parsing response: {e}")


if __name__ == "__main__":
    uvicorn.run("master:app", host="0.0.0.0", port=8080, reload=True)
