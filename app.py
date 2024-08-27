import os
import sys
import logging
from time import time
from collections import deque
from flask import Flask, request, jsonify, g, render_template
from flask_cors import CORS
from flask_caching import Cache
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

# Ensure numpy is installed
try:
    import numpy as np
except ImportError:
    print("Numpy is not installed. Installing now...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "numpy"])
    import numpy as np

# App initialization
app = Flask(__name__)
CORS(app, resources={r"/analyze": {"origins": ["chrome-extension://*"]}})
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Model setup
model_name = "distilbert-base-uncased-finetuned-sst-2-english"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)
sentiment_analyzer = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)

# Global variables
feedback_data = []
request_times = deque(maxlen=1000)
error_count = 0

# Request handlers
@app.before_request
def before_request():
    g.start = time()

@app.after_request
def after_request(response):
    global error_count
    diff = time() - g.start
    request_times.append(diff)
    if response.status_code >= 400:
        error_count += 1
    logger.info(f"Request processed in {diff:.4f} seconds")
    return response

# Routes
@app.route('/analyze', methods=['POST'])
@cache.memoize(timeout=300)
def analyze_sentiment():
    try:
        start_time = time()
        text = request.json['text']
        result = sentiment_analyzer(text)[0]
        processing_time = time() - start_time
        
        logger.info(f"Analyzed sentiment for text: {text[:50]}... (length: {len(text)})")
        logger.info(f"Sentiment: {result['label']}, Score: {result['score']:.4f}")
        logger.info(f"Processing time: {processing_time:.4f} seconds")
        
        result['processing_time'] = processing_time
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error analyzing sentiment: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/stats', methods=['GET'])
def get_stats():
    total_requests = len(request_times)
    avg_time = sum(request_times) / total_requests if total_requests > 0 else 0
    error_rate = error_count / total_requests if total_requests > 0 else 0
    return jsonify({
        "total_requests": total_requests,
        "average_processing_time": avg_time,
        "error_rate": error_rate
    })

@app.route('/feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    feedback = data.get('feedback')
    sentiment = data.get('sentiment')
    accuracy = data.get('accuracy')
    if feedback and sentiment and accuracy:
        feedback_data.append({
            'feedback': feedback,
            'sentiment': sentiment,
            'accuracy': accuracy
        })
        return jsonify({"status": "success"}), 200
    else:
        return jsonify({"status": "error", "message": "Missing data"}), 400


@app.route('/feedback/analysis', methods=['GET'])
def analyze_feedback():
    if not feedback_data:
        return jsonify({"error": "No feedback data available"})
    
    total = len(feedback_data)
    avg_accuracy = sum(f['accuracy'] for f in feedback_data) / total
    sentiment_distribution = {
        'positive': sum(1 for f in feedback_data if f['sentiment'] == 'positive') / total,
        'negative': sum(1 for f in feedback_data if f['sentiment'] == 'negative') / total,
        'neutral': sum(1 for f in feedback_data if f['sentiment'] == 'neutral') / total
    }

    return jsonify({
        "total_feedback": total,
        "average_accuracy": avg_accuracy,
        "sentiment_distribution": sentiment_distribution
    })

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

# Main
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)