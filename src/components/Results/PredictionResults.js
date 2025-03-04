import React, { useState } from 'react';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import FeedbackForm from '../FeedbackForm/FeedbackForm';
import { validatePredictionResult } from '../../utils/errorHandler';
import '../../styles/components/PredictionResults.css';

const PredictionResults = ({ prediction, inputData }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  
  const validationResult = validatePredictionResult(prediction, inputData);
  const predictionQuality = validationResult.isValid ? 'reliable' : 'questionable';
  
  const prepareFeedbackData = () => {
    return {
      area: inputData.area,
      bedrooms: inputData.bedrooms,
      bathrooms: inputData.bathrooms,
      location: inputData.location,
      age: inputData.age
    };
  };

  return (
    <div className="prediction-results">
      <Card className="mb-4 prediction-card">
        <Card.Header className="d-flex align-items-center">
          <img 
            src="/price_prediction/assets/images/result-icon.png" 
            alt="Results" 
            className="header-icon me-2"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%234f8df9' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E";
            }}
          />
          <h4 className="m-0">Prediction Results</h4>
          <Badge 
            bg={predictionQuality === 'reliable' ? 'success' : 'warning'} 
            className="ms-auto"
          >
            {predictionQuality === 'reliable' ? 'High Confidence' : 'Low Confidence'}
          </Badge>
        </Card.Header>
        
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="prediction-property">
                <h2 className="prediction-value">
                  ${Number(prediction).toLocaleString()}
                </h2>
                <p className="prediction-label">Estimated Property Value</p>
                
                {!validationResult.isValid && (
                  <div className="prediction-warning mt-2">
                    <i className="warning-icon">⚠️</i> {validationResult.message}
                  </div>
                )}
              </div>
            </Col>
            
            <Col md={6}>
              <div className="prediction-details">
                <h5>Based on your inputs:</h5>
                <ul>
                  <li><strong>Area:</strong> {inputData.area} sq ft</li>
                  <li><strong>Bedrooms:</strong> {inputData.bedrooms}</li>
                  <li><strong>Bathrooms:</strong> {inputData.bathrooms}</li>
                  <li><strong>Location:</strong> {inputData.location}</li>
                  <li><strong>Property Age:</strong> {inputData.age} years</li>
                  {inputData.amenities && (
                    <li>
                      <strong>Amenities:</strong> {inputData.amenities.join(', ')}
                    </li>
                  )}
                </ul>
              </div>
            </Col>
          </Row>
          
          <div className="text-center mt-3">
            <Button 
              variant="outline-primary" 
              onClick={() => setShowFeedback(!showFeedback)}
              className="feedback-toggle-btn"
            >
              {showFeedback ? 'Hide Feedback Form' : 'Rate This Prediction'}
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      {/* Feedback form appears below the prediction card when toggled */}
      {showFeedback && (
        <FeedbackForm 
          predictionValue={prediction}
          inputData={prepareFeedbackData()}
          onClose={() => setShowFeedback(false)}
        />
      )}
    </div>
  );
};

export default PredictionResults;
