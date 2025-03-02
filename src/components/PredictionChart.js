import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../styles/PredictionChart.css';

// Sample historical data for comparing with new predictions
const historicalData = [
  { id: 1, area: 1200, bedrooms: 2, bathrooms: 1, location: 'Suburban', age: 15, actualPrice: 355000, predictedPrice: 362000 },
  { id: 2, area: 1800, bedrooms: 3, bathrooms: 2, location: 'Downtown', age: 8, actualPrice: 590000, predictedPrice: 582000 },
  { id: 3, area: 1500, bedrooms: 3, bathrooms: 2, location: 'Suburban', age: 12, actualPrice: 425000, predictedPrice: 440000 },
  { id: 4, area: 900, bedrooms: 1, bathrooms: 1, location: 'Rural', age: 20, actualPrice: 220000, predictedPrice: 215000 },
  { id: 5, area: 2200, bedrooms: 4, bathrooms: 3, location: 'Downtown', age: 5, actualPrice: 740000, predictedPrice: 725000 },
];

const formatCurrency = (value) => {
  return `$${value.toLocaleString()}`;
};

const PredictionChart = ({ newPrediction }) => {
  // Filter for properties that are similar to the current prediction
  const getSimilarProperties = () => {
    if (!newPrediction) return historicalData;

    return historicalData.filter(property => {
      // Find properties with similar characteristics (basic similarity measure)
      const areaSimilar = Math.abs(property.area - newPrediction.input.area) < 500;
      const bedroomsSimilar = Math.abs(property.bedrooms - newPrediction.input.bedrooms) <= 1;
      const bathroomsSimilar = Math.abs(property.bathrooms - newPrediction.input.bathrooms) <= 1;
      const locationSame = property.location === newPrediction.input.location;
      const ageSimilar = Math.abs(property.age - newPrediction.input.age) < 10;

      // Return true if at least 3 characteristics are similar
      const similarityCount = [areaSimilar, bedroomsSimilar, bathroomsSimilar, locationSame, ageSimilar]
        .filter(Boolean).length;
      return similarityCount >= 3;
    });
  };

  // Get similar properties and add the new prediction
  const getChartData = () => {
    const similarProperties = getSimilarProperties().slice(0, 5);
    
    if (!newPrediction) return similarProperties;
    
    // Add the new prediction to the chart data
    return [
      ...similarProperties,
      {
        id: 'current',
        area: newPrediction.input.area,
        bedrooms: newPrediction.input.bedrooms,
        bathrooms: newPrediction.input.bathrooms,
        location: newPrediction.input.location,
        age: newPrediction.input.age,
        predictedPrice: newPrediction.price,
        isCurrent: true
      }
    ];
  };

  const chartData = getChartData();

  // Calculate average price of similar properties
  const calculateAverageActualPrice = () => {
    const propertiesWithActual = chartData.filter(p => p.actualPrice);
    if (propertiesWithActual.length === 0) return 0;
    
    const sum = propertiesWithActual.reduce((acc, p) => acc + p.actualPrice, 0);
    return sum / propertiesWithActual.length;
  };

  const averageActualPrice = calculateAverageActualPrice();

  return (
    <div className="prediction-chart-container">
      <h2>Price Comparison</h2>
      
      {chartData.length > 0 ? (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="id" 
                angle={-45} 
                textAnchor="end"
                height={70}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value === 'current' ? 'Your Property' : `Property ${value}`}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                domain={[0, 'auto']}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(value) => value === 'current' ? 'Your Property' : `Property ${value}`}
              />
              <Legend />
              <Bar 
                name="Actual Price" 
                dataKey="actualPrice" 
                fill="#8884d8" 
              />
              <Bar 
                name="Predicted Price" 
                dataKey="predictedPrice" 
                fill="#82ca9d" 
                stroke={newPrediction && "#4CAF50"} 
                strokeWidth={item => item.isCurrent ? 2 : 0}
              />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="chart-insights">
            <div className="insight-item">
              <span className="insight-label">Your Predicted Price:</span>
              <span className="insight-value">
                {newPrediction ? formatCurrency(newPrediction.price) : 'N/A'}
              </span>
            </div>
            {averageActualPrice > 0 && (
              <div className="insight-item">
                <span className="insight-label">Average Market Price (Similar Properties):</span>
                <span className="insight-value">{formatCurrency(averageActualPrice)}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="no-data-message">
          <p>No similar properties found for comparison.</p>
        </div>
      )}
      
      <div className="feature-importance">
        <h3>What Affects Property Value?</h3>
        <div className="feature-bars">
          <div className="feature-bar-item">
            <div className="feature-label">Location</div>
            <div className="feature-bar-container">
              <div className="feature-bar" style={{ width: '90%' }}></div>
              <span className="feature-percent">90%</span>
            </div>
          </div>
          <div className="feature-bar-item">
            <div className="feature-label">Area</div>
            <div className="feature-bar-container">
              <div className="feature-bar" style={{ width: '85%' }}></div>
              <span className="feature-percent">85%</span>
            </div>
          </div>
          <div className="feature-bar-item">
            <div className="feature-label">Bathrooms</div>
            <div className="feature-bar-container">
              <div className="feature-bar" style={{ width: '60%' }}></div>
              <span className="feature-percent">60%</span>
            </div>
          </div>
          <div className="feature-bar-item">
            <div className="feature-label">Bedrooms</div>
            <div className="feature-bar-container">
              <div className="feature-bar" style={{ width: '55%' }}></div>
              <span className="feature-percent">55%</span>
            </div>
          </div>
          <div className="feature-bar-item">
            <div className="feature-label">Property Age</div>
            <div className="feature-bar-container">
              <div className="feature-bar" style={{ width: '40%' }}></div>
              <span className="feature-percent">40%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionChart;
