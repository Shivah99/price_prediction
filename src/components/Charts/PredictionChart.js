import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import dbService from '../../services/IndexedDBService';
import '../../styles/components/Charts.css';

// Register Chart.js components
Chart.register(...registerables);

const PredictionChart = ({ currentPrediction }) => {
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [featureImportance, setFeatureImportance] = useState({});
  
  // Fetch prediction history
  useEffect(() => {
    const fetchPredictionHistory = async () => {
      try {
        const history = await dbService.getPredictionHistory(10);
        setPredictionHistory(history);
        
        // Calculate simple feature importance
        if (currentPrediction && history.length > 0) {
          calculateFeatureImportance(history);
        }
      } catch (error) {
        console.error('Error fetching prediction history:', error);
      }
    };
    
    fetchPredictionHistory();
  }, [currentPrediction]);
  
  // Calculate feature importance (simplified version)
  const calculateFeatureImportance = (predictions) => {
    // We'll use a simple correlation-based approach for this demo
    // In a real app, you'd use more sophisticated methods
    
    // Get all inputs and prices
    const allInputs = predictions.map(p => p.input);
    const allPrices = predictions.map(p => p.price);
    
    // Calculate average price
    const avgPrice = allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length;
    
    // Initialize importance object
    const features = ['area', 'bedrooms', 'bathrooms', 'age'];
    const importance = {};
    
    // For each feature, calculate a simplified "importance score"
    features.forEach(feature => {
      let correlation = 0;
      
      // Skip calculations if we don't have enough data
      if (allInputs.length < 3) {
        importance[feature] = 0.25; // Equal importance as fallback
        return;
      }
      
      // Calculate feature average
      const featureValues = allInputs.map(input => Number(input[feature]));
      const avgFeature = featureValues.reduce((sum, val) => sum + val, 0) / featureValues.length;
      
      // Calculate correlation using a simplified formula
      let numerator = 0;
      let denominator1 = 0;
      let denominator2 = 0;
      
      for (let i = 0; i < allPrices.length; i++) {
        const priceDiff = allPrices[i] - avgPrice;
        const featureDiff = featureValues[i] - avgFeature;
        
        numerator += priceDiff * featureDiff;
        denominator1 += priceDiff * priceDiff;
        denominator2 += featureDiff * featureDiff;
      }
      
      if (denominator1 > 0 && denominator2 > 0) {
        correlation = numerator / Math.sqrt(denominator1 * denominator2);
      }
      
      // Convert correlation to absolute value for importance
      importance[feature] = Math.abs(correlation);
    });
    
    // Add location as a feature (binary encoding)
    const locations = ['Downtown', 'Suburban', 'Rural'];
    locations.forEach(loc => {
      // Use filter result directly without storing in unused variable
      const locPrices = predictions
        .filter(p => p.input.location === loc)
        .map(p => p.price);
      
      if (locPrices.length > 0) {
        const locAvgPrice = locPrices.reduce((sum, price) => sum + price, 0) / locPrices.length;
        const priceDiff = Math.abs(locAvgPrice - avgPrice);
        importance[`location_${loc}`] = priceDiff / avgPrice;
      } else {
        importance[`location_${loc}`] = 0;
      }
    });
    
    // Normalize to percentages (0-100)
    const total = Object.values(importance).reduce((sum, val) => sum + val, 0);
    if (total > 0) {
      Object.keys(importance).forEach(feature => {
        importance[feature] = (importance[feature] / total) * 100;
      });
    }
    
    setFeatureImportance(importance);
  };

  // Prepare prediction history chart data
  const historyChartData = {
    labels: predictionHistory.map((_, index) => `Prediction ${predictionHistory.length - index}`),
    datasets: [
      {
        label: 'Predicted Price ($)',
        data: [...predictionHistory].reverse().map(p => p.price),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      }
    ]
  };
  
  // Prepare feature importance chart data
  const importanceChartData = {
    labels: Object.keys(featureImportance).map(key => {
      // Format the labels to be more readable
      if (key.startsWith('location_')) {
        return key.replace('location_', 'Location: ');
      }
      return key.charAt(0).toUpperCase() + key.slice(1);
    }),
    datasets: [
      {
        label: 'Feature Importance (%)',
        data: Object.values(featureImportance),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="charts-container">
      <div className="chart-wrapper">
        <h4>Recent Predictions</h4>
        {predictionHistory.length > 1 ? (
          <Line 
            data={historyChartData} 
            options={{
              scales: {
                y: {
                  beginAtZero: false,
                  title: {
                    display: true,
                    text: 'Price ($)'
                  }
                }
              },
              plugins: {
                title: {
                  display: true,
                  text: 'Prediction History'
                }
              }
            }}
          />
        ) : (
          <p className="no-data-message">
            Make more predictions to see historical data
          </p>
        )}
      </div>
      
      <div className="chart-wrapper">
        <h4>Feature Importance</h4>
        {Object.keys(featureImportance).length > 0 ? (
          <Bar 
            data={importanceChartData} 
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  title: {
                    display: true,
                    text: 'Importance (%)'
                  }
                }
              },
              plugins: {
                title: {
                  display: true,
                  text: 'What Affects Property Price Most?'
                }
              }
            }}
          />
        ) : (
          <p className="no-data-message">
            Make more predictions to see feature importance analysis
          </p>
        )}
      </div>
    </div>
  );
};

export default PredictionChart;
