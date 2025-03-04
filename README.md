# Price Prediction

A machine learning application for predicting prices based on various features.

## Repository

https://github.com/Shivah99/price_prediction

## Installation

## Project Overview

This application is designed to predict real estate prices based on key property features such as area, number of bedrooms, bathrooms, location, and property age. The prediction model uses a neural network implemented with Brain.js that has been trained on real estate data to provide accurate price estimations.

### Key Aspects
- **User-friendly input form** for property details
- **Neural network model** for accurate price predictions
- **Interactive data visualization** for understanding predictions
- **Persistent model storage** to retain training data
- **Responsive design** for cross-device compatibility

## Live Demo

Experience the application live: [Real Estate Price Predictor](https://Shivah99.github.io/Price_Prediction)

## How to Run Locally

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation Steps

1. Clone the repository
   ```
   git clone https://github.com/Shivah99/Price_Prediction.git
   ```

2. Navigate to the project directory
   ```
   cd Price_Prediction
   ```

3. Install dependencies
   ```
   npm install
   ```

4. Start the development server
   ```
   npm start
   ```

5. Open your browser and navigate to
   ```
   http://localhost:3000/Price_Prediction
   ```

### Building for Production

To create an optimized production build:
```
npm run build
```

To deploy to GitHub Pages:
```
npm run deploy
```

## Implementation Details

### 1. Project Setup & Git Repository
- Initialized with Create React App
- Added Brain.js for neural network implementation
- Integrated Bootstrap for responsive design
- Set up GitHub repository with continuous deployment

### 2. Data Collection & Preprocessing
- Utilized a dataset of residential properties with various features
- Applied data normalization techniques:
  - Min-max scaling for numerical features
  - One-hot encoding for categorical data like location
- Preprocessed data stored in JSON format for easy loading

### 3. Data Input Form
- Implemented a comprehensive React form with controlled components
- Form fields include:
  - Area (square footage)
  - Number of bedrooms
  - Number of bathrooms
  - Location (dropdown with common neighborhoods)
  - Property age
  - Additional amenities (checkbox options)
- Form validation ensures data quality for predictions

### 4. Neural Network Implementation
- Feedforward neural network created using Brain.js
- Network architecture:
  - Input layer for property features
  - Hidden layer with optimized neurons
  - Output layer for price prediction
- Training process includes:
  - Data splitting (80% training, 20% validation)
  - Error threshold monitoring
  - Early stopping to prevent overfitting

### 5. Prediction Functionality
- Real-time prediction as users input property details
- Price range estimation with confidence intervals
- Ability to compare with similar properties

### 6. UI Enhancements & Styling
- Bootstrap framework for responsive grid layout
- Custom CSS for brand-specific styling
- Font Awesome icons for improved user experience
- Form validation with visual feedback
- Mobile-first approach ensuring compatibility across devices

### 7. Data Visualization
- Interactive charts using Chart.js showing:
  - Predicted vs. actual property prices
  - Feature importance visualization
  - Price trends by location
  - Historical price data comparison

### 8. Persistent Model Storage
- Trained model saved in localStorage to prevent retraining
- Option to retrain with new data when available
- Export/import functionality for model sharing

## Features

- **Interactive Property Form**: Input property details with real-time validation
- **Instant Price Prediction**: Get property value estimates as you type
- **Data Visualization**: Explore prediction factors through charts
- **Location Analysis**: Compare prices across different neighborhoods
- **Responsive Design**: Seamless experience on all devices
- **Model Management**: Save and load trained models
- **Training Interface**: Ability to train custom models with your data
- **Export Results**: Save prediction results for later reference

### Bonus Feature: User Feedback & Error Handling

The application includes a comprehensive system for collecting user feedback and handling errors, ensuring a smooth user experience even when issues arise.

#### User Feedback System

Users can provide feedback about prediction accuracy through:
- A 5-point rating scale to evaluate prediction quality
- An optional text field to explain why they believe a prediction is inaccurate
- Feedback submission immediately after receiving a prediction result

This feedback is stored locally and can be used to:
- Improve the prediction model over time
- Identify patterns in prediction inaccuracies
- Target specific areas for model improvement

#### Robust Error Handling

The application features comprehensive error handling to ensure users always receive helpful guidance:

1. **Input Validation**
   - Real-time validation as users enter data
   - Clear, contextual error messages
   - Suggestions for valid input ranges
   - Prevention of form submission with invalid data

2. **Prediction Error Detection**
   - Identification of unreasonable prediction results
   - Sanity checks on predictions (e.g., price per square foot)
   - Alerts for potentially unreliable predictions

3. **Edge Case Handling**
   - Support for unusual but valid property configurations
   - Graceful handling of missing data points
   - Appropriate responses for extreme input values

4. **User-Friendly Error Messages**
   - Plain language explanations of issues
   - Specific guidance on how to resolve problems
   - Different message styles based on error severity

5. **System Error Recovery**
   - Automatic retry for temporary issues
   - Data preservation when errors occur
   - Fallback options when optimal methods fail

#### Implementation Examples

- Input fields change border color based on validation status
- Toast notifications for non-blocking warnings
- Modal dialogs for critical errors requiring attention
- Inline help text providing context-sensitive guidance
- Confidence indicators showing prediction reliability

#### Error Logging & Monitoring

The system maintains error logs to help identify recurring issues:
- Error type categorization
- Timestamps for tracking error patterns
- Input data associated with errors (anonymized)
- User feedback correlated with error instances

## Technologies Used

### Frontend
- **React.js**: Component-based UI library
- **React Router**: Navigation and routing between application views
- **React Hooks**: State management and component lifecycle
- **Bootstrap & React Bootstrap**: Responsive design components
- **Chart.js & React-Chartjs-2**: Data visualization library
- **XLSX**: For Excel file data importing/exporting

### Machine Learning
- **Brain.js**: Neural network implementation in JavaScript
- **Web Workers**: For non-blocking model training

### Storage & State Management
- **LocalStorage API**: For persistent model storage
- **React Context API**: For application-wide state management

### Development & Deployment
- **Create React App**: Project bootstrapping
- **npm**: Package management
- **Git & GitHub**: Version control
- **GitHub Pages**: Hosting and deployment platform

## Project Structure

```
price_predicter/
├── public/                  # Public assets
│   ├── index.html          # HTML entry point
│   ├── 404.html            # GitHub Pages SPA redirect
│   └── manifest.json       # Web app manifest
├── src/
│   ├── components/         # React components
│   │   ├── App.js          # Main application component
│   │   ├── Header.js       # Navigation header
│   │   ├── PredictionForm/ # Property input form components
│   │   ├── Results/        # Prediction results components
│   │   └── Visualization/  # Chart components
│   ├── data/               # Data models and sample data
│   │   └── propertyData.js # Example property data
│   ├── models/             # ML model implementations
│   │   └── neuralNetwork.js # Brain.js implementation
│   ├── styles/             # CSS and styling files
│   ├── utils/              # Utility functions
│   │   ├── dataPreprocessing.js # Data normalization
│   │   └── localStorage.js # Model persistence
│   └── index.js            # Entry point
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Future Enhancements

- **Advanced ML Algorithms**: Add more prediction models for comparison
- **User Accounts**: Save personal predictions and favorite properties
- **Real Estate API Integration**: Live data from real estate listings
- **Geospatial Analysis**: Map-based visualization of property values
- **Mortgage Calculator**: Estimate monthly payments based on predictions
- **Historical Trends**: Track price changes over time

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data sourced from open real estate datasets
- Inspired by modern real estate valuation techniques
- Thanks to the Brain.js and React.js communities for excellent documentation
