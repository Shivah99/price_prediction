import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import FeedbackForm from '../FeedbackForm/FeedbackForm';

const FeedbackButton = ({ predictionValue, inputData }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  
  return (
    <div className="feedback-container">
      {/* Feedback Button to add below your existing results */}
      <div className="text-center mt-3 mb-3">
        <Button 
          variant="outline-primary" 
          onClick={() => setShowFeedback(!showFeedback)}
          className="feedback-toggle-btn rounded-pill px-4"
        >
          {showFeedback ? 'Hide Feedback Form' : '💬 Rate This Prediction'}
        </Button>
      </div>
      
      {/* Feedback Form */}
      {showFeedback && (
        <FeedbackForm 
          predictionValue={predictionValue}
          inputData={inputData}
          onClose={() => setShowFeedback(false)}
        />
      )}
    </div>
  );
};

export default FeedbackButton;
