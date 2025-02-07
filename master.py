from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import json
import os
import uvicorn
from typing import Dict

app = FastAPI()

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
