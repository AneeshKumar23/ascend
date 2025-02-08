from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import json
import os
import logging
import uvicorn
from typing import List, Dict
import uvicorn
import google.generativeai as genai

# Configure Gemini API
genai.configure(api_key='AIzaSyD-oT3hh0IsFrkFDrkxllT81mrDRyByFBY')
model = genai.GenerativeModel('gemini-2.0-flash')

app = FastAPI()

HABITS_FILE = "habits.json"
GOALS_FILE = "goals.json"

# Ensure habits.json exists
if not os.path.exists(HABITS_FILE):
    with open(HABITS_FILE, "w") as file:
        json.dump([], file)


# Load habits from JSON file
def load_habits():
    try:
        with open(HABITS_FILE, "r") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

# Load goals from JSON file
def load_goals():
    try:
        with open(GOALS_FILE, "r") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

# Save habits to JSON file
def save_habits(habits):
    with open(HABITS_FILE, "w") as file:
        json.dump(habits, file, indent=4)


# Save goals to JSON file
def save_goals(goals):
    with open(GOALS_FILE, "w") as file:
        json.dump(goals, file, indent=4)


# Habit Data Model
class Habit(BaseModel):
    title: str
    time: str
    priority: str
    reminder: bool = False
    streak: int = 0

# Goal Data Model
class Goal(BaseModel):
    title: str
    deadline: str
    milestones: Dict[str, List[str]]
    xp: int = 100  # XP reward for completing the goal
    priority: str = "medium"  # Priority level (low, medium, high)
    progress: int = 0  # Progress percentage (0-100)

class PromptRequest(BaseModel):
    prompt: str

# Fetch All Habits
@app.get("/habits")
def get_habits():
    return load_habits()


# Add a New Habit
@app.post("/habits")
def add_habit(habit: Habit):
    habits = load_habits()

    new_habit = {
        "id": len(habits) + 1,
        "xp": 50,
        **habit.dict(),
    }

    habits.append(new_habit)
    save_habits(habits)

    return {"message": "Habit added successfully", "habit": new_habit}


# Update a Habit
@app.put("/habits/{habit_id}")
def update_habit(habit_id: int, habit: Habit):
    habits = load_habits()

    for h in habits:
        if h["id"] == habit_id:
            h.update(habit.dict())
            save_habits(habits)
            return {"message": "Habit updated successfully", "habit": h}

    raise HTTPException(status_code=404, detail="Habit not found")

# Define the request model
class StreakUpdate(BaseModel):
    completed: bool

# Gemini API for Habit Recommendations
@app.post("/recommend_habits")
def recommend_habits(request: PromptRequest):
    prompt = request.prompt
    base = """{
        type: 'bot',
        content: "Here's a suggested goal for connecting to the Gemini API with Python:\\n\\nConnect to the Gemini API with Python\\n\\nMilestones:\\n1. Set up a Google Cloud Project and enable the Gemini API.\\n2. Install the necessary Python libraries (google-generativeai).\\n3. Obtain API credentials (API key or service account).\\n4. Write a basic Python script to authenticate and make a simple request to the Gemini API.\\n5. Explore different API endpoints and parameters.\\n6. Implement error handling and logging in your Python code.\\n\\nWould you like to use this goal?",
        suggestion:   {
            "title": "Learn React Native",
            "deadline": "2024-04-01",
            "progress": 60,
            "xp": 1000,
            "priority": "high",
            "milestones": [
            {
                "id": 1,
                "title": "Complete basic tutorial",
                "completed": true,
                "xp": 200,
                "subtasks": [
                {
                    "id": 1,
                    "title": "Setup development environment",
                    "completed": true
                },
                {
                    "id": 2,
                    "title": "Learn basic components",
                    "completed": true
                }
                ]
            }
            ]
        }
    }

    I want the output you generate to be in the above structure format. Strictly follow the template and don't change the structure. Provide only 6 milestones. Do not mention the output format like JSON or Python. Generate 2 subtopics for each milestone and place them in their list."""

    try:
        response = model.generate_content(base + prompt).text
        data = json.loads(response[7:-4])
        # Load existing habits and append the new goal
        goals = load_goals()
        goals.append(data["suggestion"])
        save_goals(goals)
        return data
        # return data
    except (json.JSONDecodeError, KeyError) as e:
        raise HTTPException(status_code=500, detail=f"Error parsing response: {e}")


@app.patch("/habits/{habit_id}/streak")
def update_streak(habit_id: int, update: StreakUpdate):
    habits = load_habits()

    for h in habits:
        if h["id"] == habit_id:
            h["streak"] += 1 if update.completed else max(0, h["streak"] - 1)
            save_habits(habits)
            return {"message": "Streak updated", "habit": h}

    raise HTTPException(status_code=404, detail="Habit not found")

# Delete a Habit
@app.delete("/habits/{habit_id}")
def delete_habit(habit_id: int):
    habits = load_habits()
    updated_habits = [h for h in habits if h["id"] != habit_id]

    if len(updated_habits) == len(habits):
        raise HTTPException(status_code=404, detail="Habit not found")

    save_habits(updated_habits)
    return {"message": "Habit deleted successfully"}

# Allow CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

USERS_FILE = "users.json"

# Ensure users.json exists
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, "w") as file:
        json.dump({}, file)


# Load user data from JSON file
def load_users():
    try:
        with open(USERS_FILE, "r") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


# Save user data to JSON file
def save_users(users):
    with open(USERS_FILE, "w") as file:
        json.dump(users, file, indent=4)


# User Registration Model
class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str  # No Hashing
    avatar: str


# User Login Model
class LoginRequest(BaseModel):
    email: str
    password: str


# Register Endpoint
@app.post("/register")
def register(user: UserSignup):
    users = load_users()

    if user.email in users:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_data = {
        "id": str(len(users) + 1),
        "username": user.username,
        "email": user.email,
        "password": user.password,  # No Hashing
        "avatar": user.avatar,
        "dateJoined": "2025-02-07",
        "preferences": {
            "notifications": True,
            "theme": "dark",
        },
    }

    users[user.email] = user_data
    save_users(users)

    return {"message": "Registration successful", "user": user_data}


# Login Endpoint
@app.post("/login")
def login(request: LoginRequest):
    users = load_users()
    
    for user in users.values():
        if user["email"] == request.email and user["password"] == request.password:
            return {
                "id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "avatar": user["avatar"],
                "dateJoined": user["dateJoined"],
                "preferences": user["preferences"],
            }

    raise HTTPException(status_code=401, detail="Invalid email or password")


if __name__ == "__main__":
    uvicorn.run("master:app", host="0.0.0.0", port=8080, reload=True)
