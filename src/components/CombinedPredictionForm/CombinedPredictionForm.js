import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { validateInputs, validatePredictionResult } from '../../utils/errorHandler';
import '../../styles/components/CombinedPredictionForm.css';

const CombinedPredictionForm = ({ onPredictPrice, isLoading }) => {
  // Form flow states
  const [step, setStep] = useState('input'); // 'input', 'result'
  const [formData, setFormData] = useState({
    area: '',
    bedrooms: '',
    bathrooms: '',
    location: '',
    age: ''
  });
  const [errors, setErrors] = useState({});
  const [prediction, setPrediction] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle form submission for property details
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    const validation = validateInputs(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    // Format input data
    const inputData = {
      area: parseFloat(formData.area),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseFloat(formData.bathrooms),
      location: formData.location,
      age: parseInt(formData.age)
    };
    
    try {
      // Get prediction from parent component
      const result = await onPredictPrice(inputData);
      setPrediction(result);
      setStep('result');
    } catch (error) {
      console.error("Prediction failed:", error);
      alert("Failed to make prediction. Please try again.");
    }
  };

  // Render the property input form
  const renderPropertyForm = () => {
    return (
      <Card className="property-form-card">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Property Details</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Area (sq ft)*</Form.Label>
              <Form.Control
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                isInvalid={!!errors.area}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.area}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bedrooms*</Form.Label>
              <Form.Control
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                isInvalid={!!errors.bedrooms}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.bedrooms}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bathrooms*</Form.Label>
              <Form.Control
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                isInvalid={!!errors.bathrooms}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.bathrooms}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location*</Form.Label>
              <Form.Select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                isInvalid={!!errors.location}
                required
              >
                <option value="">Select location</option>
                <option value="Downtown">Downtown</option>
                <option value="Suburban">Suburban</option>
                <option value="Rural">Rural</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.location}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Property Age (years)*</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                isInvalid={!!errors.age}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.age}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isLoading}
                className="prediction-button"
              >
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Calculating...
                  </>
                ) : 'Predict Price'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  };

  // Render the prediction results
  const renderPredictionResults = () => {
    if (!prediction) return null;
    
    const validationResult = validatePredictionResult(prediction, formData);
    const predictionQuality = validationResult.isValid ? 'reliable' : 'questionable';
    
    return (
      <Card className="prediction-card mb-4">
        <Card.Header className="d-flex align-items-center">
          <h4 className="mb-0">Prediction Results</h4>
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
                <ul className="property-details-list">
                  <li><strong>Area:</strong> {formData.area} sq ft</li>
                  <li><strong>Bedrooms:</strong> {formData.bedrooms}</li>
                  <li><strong>Bathrooms:</strong> {formData.bathrooms}</li>
                  <li><strong>Location:</strong> {formData.location}</li>
                  <li><strong>Property Age:</strong> {formData.age} years</li>
                </ul>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  // Render the appropriate step
  const renderCurrentStep = () => {
    switch(step) {
      case 'input':
        return renderPropertyForm();
      case 'result':
        return renderPredictionResults();
      default:
        return renderPropertyForm();
    }
  };

  return (
    <div className="combined-prediction-form">
      {renderCurrentStep()}
    </div>
  );
};

export default CombinedPredictionForm;
