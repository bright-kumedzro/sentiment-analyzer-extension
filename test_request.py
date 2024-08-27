import requests

response = requests.post('http://127.0.0.1:5000/analyze', json={"text": "This is a sample text to analyze."})
print(response.json())
