import requests

url = "http://localhost:8080/recommend_habits"

data = {"prompt": "I want to be more productive in linux. I am a beginner in this domain. recommend the learning path to the user" }

res = requests.post(url, json=data)

print(res.text)