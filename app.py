from flask import Flask, render_template, request, jsonify
import os
import pickle
import joblib
import numpy as np
import logging
from datetime import datetime
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Load models and artifacts
MODEL_DIR = 'notebooks'
DL_MODEL_PATH = os.path.join(MODEL_DIR, 'dl_model.keras')
STAT_MODEL_PATH = os.path.join(MODEL_DIR, 'stat_model.joblib')
TFIDF_PATH = os.path.join(MODEL_DIR, 'tfidf_vectorizer.joblib')
TOKENIZER_PATH = os.path.join(MODEL_DIR, 'tokenizer.pkl')

# Initialize models as None
dl_model = None
stat_model = None
tfidf = None
tokenizer = None

def load_models():
    """Load all required models and artifacts"""
    global dl_model, stat_model, tfidf, tokenizer
    
    try:
        # Load deep-learning model
        logger.info(f"Loading deep learning model from {DL_MODEL_PATH}")
        dl_model = load_model(DL_MODEL_PATH)
        
        # Load statistical model + vectorizer
        logger.info(f"Loading statistical model from {STAT_MODEL_PATH}")
        stat_model = joblib.load(STAT_MODEL_PATH)
        
        logger.info(f"Loading TF-IDF vectorizer from {TFIDF_PATH}")
        tfidf = joblib.load(TFIDF_PATH)
        
        # Load Keras tokenizer
        logger.info(f"Loading tokenizer from {TOKENIZER_PATH}")
        with open(TOKENIZER_PATH, 'rb') as f:
            tokenizer = pickle.load(f)
            
        logger.info("All models loaded successfully")
        return True
    except Exception as e:
        logger.error(f"Error loading models: {str(e)}")
        return False

# Sequence length (same as during training)
MAX_LEN = 300

def classify_essay(text: str) -> tuple[str, float]:
    """Classify text as human or AI written
    
    Args:
        text: The text to classify
        
    Returns:
        tuple: (label, confidence) where label is 'Human' or 'AI'
    """
    if not all([dl_model, stat_model, tfidf, tokenizer]):
        if not load_models():
            raise RuntimeError("Models could not be loaded")
    
    # Check for empty text
    if not text or len(text.strip()) < 10:
        raise ValueError("Text is too short for reliable analysis")
    
    try:
        # 1) Stat model probability for "human"
        stat_p_human = stat_model.predict_proba(tfidf.transform([text]))[0, 1]

        # 2) DL model probability for "human"
        seq = tokenizer.texts_to_sequences([text])
        padded = pad_sequences(seq, maxlen=MAX_LEN, padding='post', truncating='post')
        dl_p_human = float(dl_model.predict(padded, verbose=0)[0, 0])

        # 3) Combined probability
        p_human = (stat_p_human + dl_p_human) / 2

        logger.info(f"Classification complete - stat: {stat_p_human:.4f}, dl: {dl_p_human:.4f}, combined: {p_human:.4f}")
        
        if p_human > 0.5:
            return "Human", p_human
        else:
            return "AI", 1 - p_human
    except Exception as e:
        logger.error(f"Error during classification: {str(e)}")
        raise

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/about')
def about():
    """Render the about page with model information"""
    return render_template('about.html')

@app.route('/classify', methods=['POST'])
def classify():
    """API endpoint to classify text"""
    try:
        # Get text from form or file
        if 'file' in request.files and request.files['file'].filename != '':
            file = request.files['file']
            text = file.read().decode('utf-8')
            logger.info(f"Processing uploaded file: {file.filename}")
        else:
            text = request.form.get('text', '')
            logger.info(f"Processing text input of length: {len(text)}")
        
        if not text.strip():
            return jsonify({'error': 'No text provided'}), 400
        
        # Classify the text
        try:
            label, confidence = classify_essay(text)
            
            # Log the result
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            logger.info(f"Classification result: {label} with {confidence:.2%} confidence")
            
            return jsonify({
                'result': label,
                'confidence': round(confidence * 100, 2),
                'text_preview': text[:200] + '...' if len(text) > 200 else text,
                'timestamp': timestamp
            })
        except ValueError as ve:
            return jsonify({'error': str(ve)}), 400
        except Exception as e:
            logger.error(f"Classification error: {str(e)}")
            return jsonify({'error': 'An error occurred during classification'}), 500
    except Exception as e:
        logger.error(f"Request processing error: {str(e)}")
        return jsonify({'error': 'Failed to process request'}), 500

@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors"""
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors"""
    logger.error(f"Server error: {str(e)}")
    return render_template('500.html'), 500

# Load models at startup
if __name__ == '__main__':
    # Create templates directory if it doesn't exist
    os.makedirs('templates', exist_ok=True)
    
    # Try to load models
    load_models()
    
    # Run the app
    app.run(debug=True, host='0.0.0.0')
