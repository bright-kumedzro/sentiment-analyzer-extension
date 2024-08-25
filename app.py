import os
import sys
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from flask_caching import Cache
# from flask_limiter import Limiter
# from flask_limiter.util import get_remote_address

import sys

try:
    import numpy as np
except ImportError:
    print("Numpy is not installed. Installing now...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "numpy"])
    import numpy as np


app = Flask(__name__)
CORS(app)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})
# limiter = Limiter(key_func=get_remote_address)
# limiter.init_app(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

model_name = "distilbert-base-uncased-finetuned-sst-2-english"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)
sentiment_analyzer = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)

@app.route('/analyze', methods=['POST'])
@cache.memoize(timeout=300)
# @limiter.limit("100 per day")
def analyze_sentiment():
    try:
        text = request.json['text']
        result = sentiment_analyzer(text)[0]
        logger.info(f"Analyzed sentiment for text: {text[:50]}...")
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error analyzing sentiment: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)