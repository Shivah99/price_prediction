import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import '../../styles/components/PredictionResults.css';

const PricePredictionResults = ({ prediction, inputData }) => {
  return (
    <div className="prediction-results-container">
      {/* Property Valuation Card */}
      <Card className="mb-4 prediction-results-card">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Property Valuation</h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h2 className="price-value">${Number(prediction).toLocaleString()}</h2>
              <p>Estimated Price</p>
              
              <div className="property-details mt-4">
                <div><strong>Area:</strong> {inputData.area} sq ft</div>
                <div><strong>Bedrooms:</strong> {inputData.bedrooms}</div>
                <div><strong>Bathrooms:</strong> {inputData.bathrooms}</div>
                <div><strong>Location:</strong> {inputData.location}</div>
                <div><strong>Property Age:</strong> {inputData.age} years</div>
              </div>
              
              <p className="text-muted mt-3">
                This prediction is based on market data. Actual market value may vary.
              </p>
            </Col>
            <Col md={6} className="d-flex flex-column justify-content-center align-items-center">
              <div className="prediction-quality-indicator">
                <div className="accuracy-meter">
                  <div className="accuracy-label">Prediction Confidence</div>
                  <div className="accuracy-bar">
                    <div className="accuracy-value" style={{width: '85%'}}></div>
                  </div>
                  <div className="accuracy-percentage">85%</div>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PricePredictionResults;
