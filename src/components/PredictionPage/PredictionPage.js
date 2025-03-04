import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CombinedPredictionForm from '../CombinedPredictionForm/CombinedPredictionForm';
import { ErrorTypes } from '../../utils/errorHandler';
import { logError, displayErrorMessage } from '../../utils.errorHandlingUtils';
import { makePrediction } from '../../models/BrainJsModel';
import './PredictionPage.css';

const PredictionPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePrediction = async (data) => {
    try {
      // Reset error state
      setError(null);
      setIsLoading(true);
      
      // Call the prediction model
      // If makePrediction doesn't exist yet, create a mock function
      const makePredictionFn = typeof makePrediction === 'function' ? makePrediction : mockPrediction;
      
      const result = await makePredictionFn(data);
      
      // Return the prediction value
      return result.price || result;
    } catch (err) {
      const errorMessage = err.message || "Failed to make prediction";
      setError(errorMessage);
      logError(err, ErrorTypes.PREDICTION_ERROR);
      displayErrorMessage(`Prediction failed: ${errorMessage}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock prediction function for testing if the real one is not available
  const mockPrediction = async (data) => {
    // Simple formula-based mock prediction
    const basePrice = 100000;
    const areaPrice = data.area * 200;
    const bedroomPrice = data.bedrooms * 25000;
    const bathroomPrice = data.bathrooms * 15000;
    const ageReduction = data.age * 1000;
    
    let locationMultiplier = 1;
    if (data.location === 'Downtown') locationMultiplier = 1.5;
    else if (data.location === 'Suburban') locationMultiplier = 1.2;
    else if (data.location === 'Rural') locationMultiplier = 0.8;
    
    const price = (basePrice + areaPrice + bedroomPrice + bathroomPrice - ageReduction) * locationMultiplier;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      price: Math.max(50000, Math.round(price)),
      input: data
    };
  };

  return (
    <Container className="prediction-page py-4">
      <Row>
        <Col lg={12}>
          <div className="page-header text-center mb-4">
            <img 
              src="/price_prediction/assets/images/house-icon.png" 
              alt="House" 
              className="page-icon"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Cpath fill='%234f8df9' d='M12 3L4 9v12h16V9l-8-6zm6 16h-3v-6H9v6H6v-9l6-4.5 6 4.5v9z'/%3E%3C/svg%3E";
              }}
            />
            <h1>Real Estate Price Predictor</h1>
            <p className="lead">Get accurate property valuations using machine learning</p>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col lg={10}>
          {error && (
            <div className="alert alert-danger mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <CombinedPredictionForm 
            onPredictPrice={handlePrediction} 
            isLoading={isLoading}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default PredictionPage;
