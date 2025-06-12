import React, { useState } from 'react';
import axios from 'axios';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    relative_compactness: '',
    surface_area: '',
    wall_area: '',
    roof_area: '',
    overall_height: '',
    orientation: '',
    glazing_area: '',
    glazing_area_distribution: '',
    model: 'random_forest'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const models = [
    { value: 'linear_regression', label: 'Linear Regression' },
    { value: 'decision_tree', label: 'Decision Tree' },
    { value: 'random_forest', label: 'Random Forest' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      // Convert string values to numbers
      const numericData = {
        ...formData,
        relative_compactness: parseFloat(formData.relative_compactness) || 0,
        surface_area: parseFloat(formData.surface_area) || 0,
        wall_area: parseFloat(formData.wall_area) || 0,
        roof_area: parseFloat(formData.roof_area) || 0,
        overall_height: parseFloat(formData.overall_height) || 0,
        orientation: parseFloat(formData.orientation) || 0,
        glazing_area: parseFloat(formData.glazing_area) || 0,
        glazing_area_distribution: parseFloat(formData.glazing_area_distribution) || 0
      };

      const response = await axios.post('http://localhost:5000/predict', numericData);
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      relative_compactness: '',
      surface_area: '',
      wall_area: '',
      roof_area: '',
      overall_height: '',
      orientation: '',
      glazing_area: '',
      glazing_area_distribution: '',
      model: 'random_forest'
    });
    setPrediction(null);
    setError('');
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Energy Efficiency Prediction</h1>
        <p>Predict building heating load based on design parameters using machine learning models</p>
      </div>

      <div className="form-container">
        <div className="form-section">
          <h2>Building Parameters</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="relative_compactness">Relative Compactness</label>
                <input
                  type="number"
                  id="relative_compactness"
                  name="relative_compactness"
                  value={formData.relative_compactness}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  max="1"
                  placeholder="0.62"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="surface_area">Surface Area (m²)</label>
                <input
                  type="number"
                  id="surface_area"
                  name="surface_area"
                  value={formData.surface_area}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  placeholder="671.5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="wall_area">Wall Area (m²)</label>
                <input
                  type="number"
                  id="wall_area"
                  name="wall_area"
                  value={formData.wall_area}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  placeholder="318.5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="roof_area">Roof Area (m²)</label>
                <input
                  type="number"
                  id="roof_area"
                  name="roof_area"
                  value={formData.roof_area}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  placeholder="220.5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="overall_height">Overall Height (m)</label>
                <input
                  type="number"
                  id="overall_height"
                  name="overall_height"
                  value={formData.overall_height}
                  onChange={handleInputChange}
                  step="0.25"
                  min="0"
                  placeholder="3.5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="orientation">Orientation</label>
                <select
                  id="orientation"
                  name="orientation"
                  value={formData.orientation}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Orientation</option>
                  <option value="2">North (2)</option>
                  <option value="3">East (3)</option>
                  <option value="4">South (4)</option>
                  <option value="5">West (5)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="glazing_area">Glazing Area (%)</label>
                <input
                  type="number"
                  id="glazing_area"
                  name="glazing_area"
                  value={formData.glazing_area}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  max="1"
                  placeholder="0.25"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="glazing_area_distribution">Glazing Area Distribution</label>
                <select
                  id="glazing_area_distribution"
                  name="glazing_area_distribution"
                  value={formData.glazing_area_distribution}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Distribution</option>
                  <option value="0">Uniform (0)</option>
                  <option value="1">North (1)</option>
                  <option value="2">East (2)</option>
                  <option value="3">South (3)</option>
                  <option value="4">West (4)</option>
                  <option value="5">North & East (5)</option>
                </select>
              </div>
            </div>

            <div className="model-selector">
              <label htmlFor="model">Select Prediction Model</label>
              <select
                id="model"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
              >
                {models.map(model => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="submit"
                className="predict-button"
                disabled={loading}
              >
                {loading ? 'Predicting...' : 'Predict Heating Load'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="reset-button"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>

        <div className="results-section">
          <h2>Prediction Results</h2>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {loading && (
            <div className="loading">
              Processing your prediction...
            </div>
          )}

          {prediction && !loading && (
            <div className="result-card">
              <div className="result-value">
                {prediction.heating_load_prediction.toFixed(2)}
              </div>
              <div className="result-label">
                kWh/m² (Heating Load)
              </div>
              <div className="result-model">
                Model: {models.find(m => m.value === prediction.model_used)?.label}
              </div>
            </div>
          )}

          {!prediction && !loading && !error && (
            <div className="no-results">
              Enter building parameters and click "Predict Heating Load" to see results
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;