# import requests

# url = "http://localhost:8080/recommend_habits"

# params = {
#         "prompt": "give me a habit tracking to learn react"
#     }

# response = requests.post(url, json=params)

# data = response.json()

# assert isinstance(data, dict), "Response should be a dictionary"

# for milestone, subtopics in data.items():
#         assert isinstance(subtopics, list), f"Subtopics for {milestone} should be a list"
#         assert len(subtopics) == 2, f"Expected 2 subtopics for {milestone}, found {len(subtopics)}"

# print("Test passed!")

import requests
import time

# Base URL for your FastAPI app
BASE_URL = "http://127.0.0.1:8080"

def test_recommend_habits():
    # Define the prompt for habit recommendations
    payload = {
        "prompt": "give me recommendations for learning ml from scratch"
    }

    # Send POST request to the /recommend_habits endpoint
    response = requests.post(f"{BASE_URL}/recommend_habits", json=payload)

    # Check if the response status code is 200 OK
    assert response.status_code == 200, f"Expected 200 OK, got {response.status_code}"

    # Parse the response JSON
    data = response.json()
    
    print(data)

    # Verify the response is a dictionary (milestones)
    assert isinstance(data, dict), "Response should be a dictionary of milestones"

    # Check that there are exactly 6 milestones in the response
    assert len(data) == 6, f"Expected 6 milestones, but got {len(data)}"

    # Check that each milestone has exactly 2 subtopics
    for milestone, subtopics in data.items():
        assert isinstance(subtopics, list), f"Subtopics for '{milestone}' should be a list"
        assert len(subtopics) == 2, f"Expected 2 subtopics for '{milestone}', but got {len(subtopics)}"

    print("Test passed successfully!")

if __name__ == "__main__":
    start = time.perf_counter()
    test_recommend_habits()
    end = time.perf_counter()
    
    print("delta = " + str(end - start))
