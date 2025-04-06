from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.models import Goal, Habit, PromptRequest, StreakUpdate, UserSignup, LoginRequest
from backend.config import HABITS_FILE, USERS_FILE, GOALS_FILE, MODEL_NAME, BASE_PROMPT, OLLAMA_HOST
from utils import *
import json
import os
import uvicorn
import ollama



app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )



@app.get("/habits")
def get_habits():
    return load_habits()


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


@app.put("/habits/{habit_id}")
def update_habit(habit_id: int, habit: Habit):
    habits = load_habits()

    for h in habits:
        if h["id"] == habit_id:
            h.update(habit.dict())
            save_habits(habits)
            return {"message": "Habit updated successfully", "habit": h}

    raise HTTPException(status_code=404, detail="Habit not found")



@app.post("/recommend_habits")
def recommend_habits(request: PromptRequest):
    prompt = request.prompt
    base = BASE_PROMPT

    try:
        client = ollama.Client(host=OLLAMA_HOST)
        
        response = client.generate(model=MODEL_NAME, prompt=base + prompt)
        data = json.loads(response['response'])
        
        goals = load_goals()
        goals.append(data["suggestion"])
        save_goals(goals)
        return data
        
    except (json.JSONDecodeError, KeyError) as e:
        raise HTTPException(status_code=500, detail=f"Error parsing response: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {e}")


@app.patch("/habits/{habit_id}/streak")
def update_streak(habit_id: int, update: StreakUpdate):
    habits = load_habits()

    for h in habits:
        if h["id"] == habit_id:
            h["streak"] += 1 if update.completed else max(0, h["streak"] - 1)
            save_habits(habits)
            return {"message": "Streak updated", "habit": h}

    raise HTTPException(status_code=404, detail="Habit not found")


@app.delete("/habits/{habit_id}")
def delete_habit(habit_id: int):
    habits = load_habits()
    updated_habits = [h for h in habits if h["id"] != habit_id]

    if len(updated_habits) == len(habits):
        raise HTTPException(status_code=404, detail="Habit not found")

    save_habits(updated_habits)
    return {"message": "Habit deleted successfully"}


@app.post("/register")
def register(user: UserSignup):
    users = load_users()

    if user.email in users:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_data = {
        "id": str(len(users) + 1),
        "username": user.username,
        "email": user.email,
        "password": user.password,  
        "avatar": user.avatar,
        "dateJoined": datetime.now().strftime("%Y-%m-%d"),
        "preferences": {
            "notifications": True,
            "theme": "dark",
        },
    }

    users[user.email] = user_data
    save_users(users)

    return {"message": "Registration successful", "user": user_data}



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

    if not os.path.exists(HABITS_FILE):
        with open(HABITS_FILE, "w") as file:
            json.dump([], file)

    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, "w") as file:
            json.dump({}, file)


    uvicorn.run("master:app", host="0.0.0.0", port=8080)
