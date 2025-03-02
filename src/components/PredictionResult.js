import React from 'react';
import '../styles/PredictionResult.css';

const PredictionResult = ({ prediction, isLoading, isModelLoading, error, modelName }) => {
  
  // Format currency with commas and no decimal places
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderContent = () => {
    if (error && !prediction) {
      return (
        <div className="error-state">
          <i className="fas fa-exclamation-circle error-icon"></i>
          <h3>Prediction Error</h3>
          <p>{error}</p>
          <p className="error-help">Please check your inputs and try again.</p>
        </div>
      );
    }
    
    if (isModelLoading) {
      return (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Initializing prediction model...</p>
          <p className="loading-subtitle">This may take a few moments</p>
        </div>
      );
    }
    
    if (isLoading) {
      return (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Calculating property value...</p>
        </div>
      );
    }
    
    if (!prediction) {
      return (
        <div className="empty-state">
          <i className="fas fa-home empty-icon"></i>
          <h3>Ready to Predict</h3>
          <p>Fill out the form and click "Predict Price" to get an estimated property value.</p>
        </div>
      );
    }
    
    return (
      <div className="prediction-content">
        <div className="price-highlight">
          <span className="price-label">Estimated Price</span>
          <span className="price-value">{formatCurrency(prediction.price)}</span>
        </div>
        
        <div className="prediction-details">
          <div className="detail-item">
            <i className="fas fa-vector-square"></i>
            <span className="detail-label">Area:</span>
            <span className="detail-value">{prediction.input.area} sq ft</span>
          </div>
          
          <div className="detail-item">
            <i className="fas fa-bed"></i>
            <span className="detail-label">Bedrooms:</span>
            <span className="detail-value">{prediction.input.bedrooms}</span>
          </div>
          
          <div className="detail-item">
            <i className="fas fa-bath"></i>
            <span className="detail-label">Bathrooms:</span>
            <span className="detail-value">{prediction.input.bathrooms}</span>
          </div>
          
          <div className="detail-item">
            <i className="fas fa-map-marker-alt"></i>
            <span className="detail-label">Location:</span>
            <span className="detail-value">{prediction.input.location}</span>
          </div>
          
          <div className="detail-item">
            <i className="fas fa-calendar-alt"></i>
            <span className="detail-label">Property Age:</span>
            <span className="detail-value">{prediction.input.age} years</span>
          </div>
        </div>
        
        <div className="prediction-disclaimer">
          <p>This prediction is based on market data. Actual market value may vary.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="prediction-result-container">
      <h2>
        Property Valuation
        {modelName && !isModelLoading && (
          <span className="model-name-badge">Using: {modelName}</span>
        )}
      </h2>
      {renderContent()}
    </div>
  );
};

export default PredictionResult;
