import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(api_key=os.getenv("API_KEY"))

MODEL_NAME = "gemini-2.0-flash"
MODEL = genai.GenerativeModel(MODEL_NAME)

HABITS_FILE = os.path.join("database", "habits.json")
GOALS_FILE = os.path.join("database", "goals.json")
USERS_FILE = os.path.join("database", "users.json")

BASE_PROMPT = """{
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
