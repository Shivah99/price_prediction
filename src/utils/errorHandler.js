// Error type definitions
export const ErrorTypes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PREDICTION_ERROR: 'PREDICTION_ERROR',
  MODEL_ERROR: 'MODEL_ERROR',
  DATA_ERROR: 'DATA_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

/**
 * Validates user input for property prediction
 * @param {Object} formData - The form data to validate
 * @returns {Object} Validation result with isValid flag and error messages
 */
export const validateInputs = (formData) => {
  const errors = {};
  let isValid = true;

  // Check area
  if (!formData.area) {
    errors.area = "Area is required";
    isValid = false;
  } else if (isNaN(formData.area) || parseFloat(formData.area) <= 0) {
    errors.area = "Please enter a valid positive number";
    isValid = false;
  } else if (parseFloat(formData.area) > 10000) {
    errors.area = "Area cannot exceed 10,000 sq ft";
    isValid = false;
  }

  // Check bedrooms
  if (!formData.bedrooms) {
    errors.bedrooms = "Number of bedrooms is required";
    isValid = false;
  } else if (isNaN(formData.bedrooms) || parseInt(formData.bedrooms) <= 0) {
    errors.bedrooms = "Please enter a valid positive number";
    isValid = false;
  } else if (parseInt(formData.bedrooms) > 10) {
    errors.bedrooms = "Number of bedrooms cannot exceed 10";
    isValid = false;
  }

  // Check bathrooms
  if (!formData.bathrooms) {
    errors.bathrooms = "Number of bathrooms is required";
    isValid = false;
  } else if (isNaN(formData.bathrooms) || parseFloat(formData.bathrooms) <= 0) {
    errors.bathrooms = "Please enter a valid positive number";
    isValid = false;
  } else if (parseFloat(formData.bathrooms) > 10) {
    errors.bathrooms = "Number of bathrooms cannot exceed 10";
    isValid = false;
  }

  // Check location
  if (!formData.location) {
    errors.location = "Location is required";
    isValid = false;
  }

  // Check age
  if (!formData.age) {
    errors.age = "Property age is required";
    isValid = false;
  } else if (isNaN(formData.age) || parseInt(formData.age) < 0) {
    errors.age = "Please enter a valid non-negative number";
    isValid = false;
  } else if (parseInt(formData.age) > 150) {
    errors.age = "Property age cannot exceed 150 years";
    isValid = false;
  }

  return { isValid, errors };
};

/**
 * Validates prediction results to check if they make sense
 * @param {number} prediction - The predicted price
 * @param {Object} inputData - The input data used for prediction
 * @returns {Object} Validation result with isValid flag and messages
 */
export const validatePredictionResult = (prediction, inputData) => {
  // Basic sanity checks
  if (!prediction || prediction <= 0) {
    return {
      isValid: false,
      message: "The prediction appears to be invalid. Please try again."
    };
  }

  // Convert inputs to numbers for comparison
  const area = parseFloat(inputData.area);
  const bedrooms = parseInt(inputData.bedrooms);
  const age = parseInt(inputData.age);

  // Flag for extremely high prices for older properties
  if (age > 50 && prediction > 2000000) {
    return {
      isValid: false,
      message: "The prediction seems unusually high for an older property."
    };
  }

  // Flag for extremely low prices (market dependent, adjust as needed)
  // This is a simplified example - real validation would be more sophisticated
  if (prediction < 50000) {
    return {
      isValid: false,
      message: "The predicted price is unusually low. Consider checking your inputs."
    };
  }

  // Flag for extremely high prices based on inputs
  if (area < 1000 && bedrooms <= 2 && prediction > 1000000) {
    return {
      isValid: false,
      message: "The prediction seems unusually high for a small property."
    };
  }

  // Check for unrealistic price/sqft ratios based on location
  const pricePerSqFt = prediction / area;
  
  let maxPricePerSqFt;
  switch(inputData.location) {
    case 'Downtown':
      maxPricePerSqFt = 2000; // Example threshold for downtown
      break;
    case 'Suburban':
      maxPricePerSqFt = 1000; // Example threshold for suburban
      break;
    case 'Rural':
      maxPricePerSqFt = 500;  // Example threshold for rural
      break;
    default:
      maxPricePerSqFt = 1500; // Default threshold
  }

  if (pricePerSqFt > maxPricePerSqFt) {
    return {
      isValid: false,
      message: `The price per square foot (${pricePerSqFt.toFixed(0)}) is unusually high for this location.`
    };
  }

  // If no issues found, the prediction is considered valid
  return {
    isValid: true,
    message: "Prediction appears to be reasonable."
  };
};

/**
 * Handle and format API errors
 * @param {Error} error - The error object
 * @returns {Object} Formatted error with code and message
 */
export const handleApiError = (error) => {
  // Default error info
  let errorInfo = {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred. Please try again.'
  };

  // Check if it's a network error
  if (error.message === 'Network Error' || !navigator.onLine) {
    errorInfo = {
      code: 'NETWORK_ERROR',
      message: 'Network connection issue detected. Please check your internet connection.'
    };
  } 
  // Check if it's a timeout
  else if (error.code === 'ECONNABORTED') {
    errorInfo = {
      code: 'TIMEOUT',
      message: 'The request took too long to complete. Please try again.'
    };
  }
  // Check if there's a response with error information
  else if (error.response) {
    // Handle different HTTP status codes
    switch (error.response.status) {
      case 400:
        errorInfo = {
          code: 'BAD_REQUEST',
          message: 'Invalid request. Please check your input data.'
        };
        break;
      case 401:
      case 403:
        errorInfo = {
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to perform this action.'
        };
        break;
      case 404:
        errorInfo = {
          code: 'NOT_FOUND',
          message: 'The requested resource was not found.'
        };
        break;
      case 500:
      case 502:
      case 503:
        errorInfo = {
          code: 'SERVER_ERROR',
          message: 'Server error. Please try again later.'
        };
        break;
      default:
        errorInfo = {
          code: `HTTP_${error.response.status}`,
          message: error.response.data?.message || 'An error occurred with the request.'
        };
    }
  }

  console.error('API Error:', errorInfo.code, error);
  return errorInfo;
};

/**
 * Logs errors to a monitoring service (mock implementation)
 * @param {Error} error - The error object
 * @param {Object} contextData - Additional context information
 */
export const logErrorToMonitoring = (error, contextData = {}) => {
  // This is a mock implementation
  // In a real app, you would send this to a service like Sentry, LogRocket, etc.
  console.error('ERROR LOG:', {
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    context: contextData,
    userAgent: navigator.userAgent
  });
};
