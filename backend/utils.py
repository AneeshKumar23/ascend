from config import HABITS_FILE, GOALS_FILE, USERS_FILE
import json


def load_habits():
    try:
        with open(HABITS_FILE, "r") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return []
    

def load_goals():
    try:
        with open(GOALS_FILE, "r") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return []
    

def save_habits(habits):
    with open(HABITS_FILE, "w") as file:
        json.dump(habits, file, indent=4)


def save_goals(goals):
    with open(GOALS_FILE, "w") as file:
        json.dump(goals, file, indent=4)


def load_users():
    try:
        with open(USERS_FILE, "r") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}



def save_users(users):
    with open(USERS_FILE, "w") as file:
        json.dump(users, file, indent=4)
