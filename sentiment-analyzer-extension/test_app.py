# test_app.py

import unittest
from app import app
import json

class TestSentimentAnalyzer(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_sentiment_analysis(self):
        response = self.app.post('/analyze', json={'text': 'I love this!'})
        
        print(f"Response status: {response.status_code}")
        print(f"Response data: {response.data}")
        
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('label', data)
        self.assertIn('score', data)

if __name__ == '__main__':
    unittest.main()