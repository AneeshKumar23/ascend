from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import json
import os
import uvicorn
from typing import Dict

app = FastAPI()

HABITS_FILE = "habits.json"

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


# Save habits to JSON file
def save_habits(habits):
    with open(HABITS_FILE, "w") as file:
        json.dump(habits, file, indent=4)


# Habit Data Model
class Habit(BaseModel):
    title: str
    time: str
    priority: str
    reminder: bool = False
    streak: int = 0


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
