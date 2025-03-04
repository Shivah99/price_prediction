# Real Estate Price Prediction App

A machine learning web application that predicts real estate prices based on property features using Brain.js neural networks.

## Project Overview

This application uses React.js for the frontend interface and Brain.js to implement a neural network model that predicts property prices. Users can input property details like area, number of bedrooms, bathrooms, location, and age, and get a predicted price based on the trained model.

Key features:
- Property prediction based on multiple factors
- Neural network implementation with Brain.js
- Data visualization of prediction history and feature importance
- Local model storage using IndexedDB
- Error handling and input validation

## Technologies Used

- **Frontend**: React.js, Bootstrap, CSS
- **Neural Network**: Brain.js
- **Data Visualization**: Chart.js
- **Storage**: IndexedDB
- **Deployment**: GitHub Pages / Vercel / Netlify

## How to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shivah99/price_prediction.git
   cd price_prediction
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**  
   Navigate to http://localhost:3000

## Features in Detail

### 1. Neural Network Model
- The app uses a feedforward neural network implemented with Brain.js
- The model is trained on property features to predict prices
- Neural network configuration can be adjusted in the settings

### 2. Data Input & Validation
- Users can input property details through a form
- All inputs are validated to ensure data quality
- Error messages guide users to provide valid information

### 3. Prediction Functionality
- The model predicts property prices based on user input
- Results are displayed with confidence indicators
- Users can compare predictions with history

### 4. Data Visualization
- Charts display prediction history
- Feature importance is visualized to help users understand what factors affect price most
- Responsive charts adapt to different screen sizes

### 5. Model Storage
- Trained models are stored locally using IndexedDB
- Users can save and load different models
- Each prediction is stored to improve future predictions

### 6. Error Handling
- The app handles various error scenarios gracefully
- Fallback strategies ensure the app continues to function even when parts fail
- User-friendly error messages are displayed when needed

## Future Improvements

- Add more property features for more accurate predictions
- Implement more advanced neural network architectures
- Add user accounts for personalized model training
- Integrate with real estate APIs for data validation
- Add export/import functionality for models

## Deployment

The application is deployed and available at: [https://shivah99.github.io/price_prediction/](https://shivah99.github.io/price_prediction/)
