import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { saveFeedback } from '../../utils/feedbackService';
import '../../styles/components/FeedbackForm.css';

const FeedbackForm = ({ predictionValue, inputData, onClose }) => {
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  
  // Define emojis for each rating level
  const ratingEmojis = {
    1: { emoji: '🙄', label: 'Poor' },
    2: { emoji: '😕', label: 'Fair' },
    3: { emoji: '🤔', label: 'Okay' },
    4: { emoji: '😊', label: 'Good' },
    5: { emoji: '🤩', label: 'Excellent' }
  };

  // Auto-submit if rating is 5 (excellent)
  useEffect(() => {
    const handleAutoSubmit = async () => {
      // Only auto-submit if rating is 5 and form hasn't been submitted already
      if (rating === 5 && !submitted && !isSubmitting) {
        setIsSubmitting(true);
        try {
          await saveFeedback({
            prediction: predictionValue,
            inputData: inputData,
            rating: 5,
            feedback: "Excellent prediction!",
            timestamp: new Date().toISOString()
          });
          setSubmitted(true);
          
          // Close after a short delay
          setTimeout(() => {
            if (onClose) onClose();
          }, 1500);
        } catch (error) {
          console.error('Error auto-submitting feedback:', error);
          setError('Failed to submit feedback. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      }
    };
    
    if (rating === 5) {
      handleAutoSubmit();
    }
  }, [rating, submitted, isSubmitting, predictionValue, inputData, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create feedback object
      const feedback = {
        prediction: predictionValue,
        inputData: inputData,
        rating: rating,
        feedback: comment,
        timestamp: new Date().toISOString()
      };
      
      // Submit feedback
      await saveFeedback(feedback);
      setSubmitted(true);
      
      // Close after a short delay
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render thank you message after submission
  if (submitted) {
    return (
      <Card className="feedback-form-card">
        <Card.Body className="text-center">
          <div className="success-icon">{rating === 5 ? '🤩' : '✅'}</div>
          <h4>Thank You For Your Feedback!</h4>
          <p>Your input helps us improve our prediction model accuracy.</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="feedback-form-card">
      <Card.Header>
        <h4>Rate This Prediction</h4>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="mb-2">How accurate do you think this prediction is?</p>
            <div className="rating-selector">
              {[1, 2, 3, 4, 5].map(value => (
                <Button 
                  key={value}
                  variant={rating === value ? 'primary' : 'outline-secondary'}
                  onClick={() => setRating(value)}
                  className="rating-button"
                  disabled={isSubmitting}
                >
                  <div className="rating-emoji">
                    {ratingEmojis[value].emoji}
                  </div>
                  <div className="rating-label">
                    {ratingEmojis[value].label}
                  </div>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Only show comment field for ratings 1-4 */}
          {rating < 5 && (
            <Form.Group className="mb-3">
              <Form.Label>Please tell us why the prediction seems {ratingEmojis[rating].label.toLowerCase()} to you:</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Your feedback helps us improve our model..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required={rating < 3}
                disabled={isSubmitting}
              />
              {rating < 3 && (
                <Form.Text className="text-muted">
                  Please provide details so we can improve our predictions.
                </Form.Text>
              )}
            </Form.Group>
          )}
          
          {/* Only show submit button for ratings 1-4 */}
          {rating < 5 && (
            <div className="d-flex justify-content-end">
              <Button 
                variant="outline-secondary" 
                onClick={onClose}
                className="me-2"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={isSubmitting || (rating < 3 && !comment)}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FeedbackForm;
