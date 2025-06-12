from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Load models
MODEL_DIR = Path(__file__).parent / 'models'

try:
    linear_model = joblib.load(MODEL_DIR / 'linear_regression.joblib')
    decision_tree_model = joblib.load(MODEL_DIR / 'decision_tree.joblib')
    random_forest_model = joblib.load(MODEL_DIR / 'random_forest.joblib')
    print("All models loaded successfully!")
except Exception as e:
    print(f"Error loading models: {e}")

# Model mapping
MODELS = {
    'linear_regression': linear_model,
    'decision_tree': decision_tree_model,
    'random_forest': random_forest_model
}

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Energy Efficiency Prediction API",
        "status": "running",
        "available_models": list(MODELS.keys())
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Extract features from request
        features = [
            data.get('relative_compactness', 0),
            data.get('surface_area', 0),
            data.get('wall_area', 0),
            data.get('roof_area', 0),
            data.get('overall_height', 0),
            data.get('orientation', 0),
            data.get('glazing_area', 0),
            data.get('glazing_area_distribution', 0)
        ]
        
        # Convert to numpy array and reshape
        features_array = np.array(features).reshape(1, -1)
        
        # Get selected model
        model_name = data.get('model', 'random_forest')
        
        if model_name not in MODELS:
            return jsonify({
                'error': 'Invalid model selected',
                'available_models': list(MODELS.keys())
            }), 400
        
        # Make prediction
        model = MODELS[model_name]
        prediction = model.predict(features_array)[0]
        
        return jsonify({
            'heating_load_prediction': float(prediction),
            'model_used': model_name,
            'input_features': {
                'relative_compactness': features[0],
                'surface_area': features[1],
                'wall_area': features[2],
                'roof_area': features[3],
                'overall_height': features[4],
                'orientation': features[5],
                'glazing_area': features[6],
                'glazing_area_distribution': features[7]
            }
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Prediction failed: {str(e)}'
        }), 500

@app.route('/models', methods=['GET'])
def get_models():
    return jsonify({
        'available_models': [
            {
                'name': 'linear_regression',
                'display_name': 'Linear Regression',
                'description': 'Simple linear model for baseline predictions'
            },
            {
                'name': 'decision_tree',
                'display_name': 'Decision Tree',
                'description': 'Tree-based model for non-linear patterns'
            },
            {
                'name': 'random_forest',
                'display_name': 'Random Forest',
                'description': 'Ensemble model for robust predictions'
            }
        ]
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'models_loaded': len(MODELS),
        'models': list(MODELS.keys())
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

#python app.py