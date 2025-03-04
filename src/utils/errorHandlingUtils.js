/**
 * Utility functions for better error handling in the application
 */

import { ErrorTypes } from './errorHandler';

// Display a user-friendly error message
export const displayErrorMessage = (message, duration = 5000) => {
  // Create error toast element
  const errorToast = document.createElement('div');
  errorToast.className = 'error-toast';
  errorToast.innerHTML = `
    <div class="error-icon">⚠️</div>
    <div class="error-content">
      <h4>Error</h4>
      <p>${message}</p>
    </div>
    <button class="dismiss-btn">&times;</button>
  `;
  
  // Add to document
  document.body.appendChild(errorToast);
  
  // Add styles
  errorToast.style.position = 'fixed';
  errorToast.style.bottom = '20px';
  errorToast.style.right = '20px';
  errorToast.style.backgroundColor = 'white';
  errorToast.style.border = '1px solid #ffcccc';
  errorToast.style.borderLeft = '5px solid #ff3333';
  errorToast.style.borderRadius = '4px';
  errorToast.style.padding = '15px';
  errorToast.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
  errorToast.style.display = 'flex';
  errorToast.style.alignItems = 'center';
  errorToast.style.zIndex = '9999';
  errorToast.style.minWidth = '300px';
  errorToast.style.maxWidth = '450px';
  
  // Add animation
  errorToast.style.transition = 'all 0.3s ease';
  errorToast.style.opacity = '0';
  errorToast.style.transform = 'translateY(20px)';
  
  // Show with animation
  setTimeout(() => {
    errorToast.style.opacity = '1';
    errorToast.style.transform = 'translateY(0)';
  }, 10);
  
  // Add dismiss handler
  const dismissBtn = errorToast.querySelector('.dismiss-btn');
  dismissBtn.style.backgroundColor = 'transparent';
  dismissBtn.style.border = 'none';
  dismissBtn.style.fontSize = '20px';
  dismissBtn.style.cursor = 'pointer';
  dismissBtn.style.marginLeft = 'auto';
  
  const removeToast = () => {
    errorToast.style.opacity = '0';
    errorToast.style.transform = 'translateY(20px)';
    setTimeout(() => {
      if (document.body.contains(errorToast)) {
        document.body.removeChild(errorToast);
      }
    }, 300);
  };
  
  dismissBtn.addEventListener('click', removeToast);
  
  // Auto dismiss after duration
  setTimeout(removeToast, duration);
  
  return errorToast;
};

// Log error to console with enhanced formatting
export const logError = (error, context = '') => {
  const errorType = typeof context === 'string' ? context : 
                   (context && context in ErrorTypes) ? context : 'UNKNOWN_ERROR';
  
  console.error(
    `%c${errorType} Error: %c${error.message || error}`,
    'color: white; background-color: #e74c3c; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
    'color: #e74c3c; font-weight: normal;'
  );
  
  console.error(error);
};

// Fallback function when model prediction fails
export const getFallbackPrediction = (inputData) => {
  // Simple formula to give somewhat reasonable results when the model fails
  const basePrice = 100000;
  const areaMultiplier = 200;
  const bedroomValue = 50000;
  const bathroomValue = 25000;
  const ageDeduction = 1000;
  
  let locationFactor = 1;
  if (inputData.location === 'Downtown') locationFactor = 1.5;
  else if (inputData.location === 'Suburban') locationFactor = 1.2;
  else if (inputData.location === 'Rural') locationFactor = 0.8;
  
  const estimatedValue = (
    basePrice + 
    (inputData.area * areaMultiplier) + 
    (inputData.bedrooms * bedroomValue) + 
    (inputData.bathrooms * bathroomValue) - 
    (inputData.age * ageDeduction)
  ) * locationFactor;
  
  return Math.max(estimatedValue, 50000); // Ensure minimum reasonable value
};
