# Real Estate Price Predictor

![Real Estate Price Predictor](https://raw.githubusercontent.com/Shivah99/Price_Prediction/main/public/logo192.png)

A machine learning web application that predicts real estate prices using neural networks. This application allows users to input property details and receive an estimated price based on a trained model.

## Project Overview

The Real Estate Price Predictor uses Brain.js to create and train a neural network model on real estate data. It provides an intuitive interface for users to input property details such as location, size, number of bedrooms, and other factors to get accurate price predictions.

### Features

- **Machine Learning-Based Predictions**: Uses neural networks to predict property prices
- **Interactive UI**: Easy-to-use interface for entering property details
- **Data Visualization**: Charts showing prediction results and comparisons
- **Excel to JSON Conversion**: Upload and convert Excel datasets
- **Mobile-Responsive Design**: Works on devices of all sizes

### Technologies Used

- **Frontend**: React.js
- **Machine Learning**: Brain.js
- **Data Visualization**: Chart.js, Recharts
- **Styling**: CSS, Bootstrap
- **Data Processing**: XLSX.js for Excel file handling
- **Storage**: IndexedDB for client-side data persistence

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shivah99/Price_Prediction.git
   cd Price_Prediction
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   The application will be available at [http://localhost:3000](http://localhost:3000)

## Deployment

The application is deployed using GitHub Pages. You can access the live version at [https://shivah99.github.io/Price_Prediction](https://shivah99.github.io/Price_Prediction)

### Deploying to GitHub Pages

To deploy the application to GitHub Pages:

1. **Install the GitHub Pages package:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add the following scripts to your package.json:**
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```

3. **Add homepage field to your package.json:**
   ```json
   "homepage": "https://[your-username].github.io/Price_Prediction"
   ```

4. **Deploy the application:**
   ```bash
   npm run deploy
   ```

## Usage Guide

1. **Input Property Details:**
   - Enter the property area in square feet
   - Select the number of bedrooms and bathrooms
   - Choose the property location
   - Enter the property age

2. **Get Prediction:**
   - Click on the "Predict Price" button
   - View the predicted price and confidence interval
   - Observe the visual representation in the charts

3. **Data Management:**
   - Upload Excel datasets using the Data Converter
   - View dataset statistics
   - Retrain the model with new data (Admin feature)

## Project Structure

- `/public` - Static files and index.html
- `/src` - React source code
  - `/components` - Reusable UI components
  - `/models` - Brain.js model implementations
  - `/conversion` - Excel to JSON conversion utilities
  - `/utils` - Helper functions and data processing
  - `/services` - API and data services
  - `/styles` - CSS stylesheets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Brain.js](https://brain.js.org/) for the neural network implementation
- [Create React App](https://create-react-app.dev/) for bootstrapping the project
- [Chart.js](https://www.chartjs.org/) for data visualization
- [Bootstrap](https://getbootstrap.com/) for UI components
