import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dbService from '../services/IndexedDBService';
import '../styles/PredictionHistory.css';

const PredictionHistory = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const loadPredictions = async () => {
    try {
      setLoading(true);
      const history = await dbService.getPredictionHistory(30);
      setPredictions(history);
    } catch (error) {
      console.error("Error loading prediction history:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (isExpanded) {
      loadPredictions();
    }
  }, [isExpanded]);
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };
  
  const getChartData = () => {
    return predictions
      .slice() // Create a copy
      .sort((a, b) => a.timestamp - b.timestamp) // Sort by timestamp ascending
      .map((prediction, index) => ({
        name: index + 1,
        price: prediction.price,
        area: prediction.input.area,
        bedrooms: prediction.input.bedrooms,
        bathrooms: prediction.input.bathrooms,
        location: prediction.input.location,
        age: prediction.input.age,
        timestamp: prediction.timestamp
      }));
  };
  
  const chartData = getChartData();
  
  // Group by location
  const locationGroups = predictions.reduce((acc, prediction) => {
    const location = prediction.input.location;
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(prediction);
    return acc;
  }, {});
  
  return (
    <div className={`prediction-history ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="prediction-history-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>
          <i className="fas fa-history"></i> Prediction History
          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} toggle-icon`}></i>
        </h3>
      </div>
      
      {isExpanded && (
        <div className="prediction-history-content">
          {loading ? (
            <div className="loading">Loading history...</div>
          ) : predictions.length === 0 ? (
            <div className="no-data">No prediction history found. Make some predictions to see your history.</div>
          ) : (
            <>
              <div className="chart-container">
                <h4>Price Trend</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={formatCurrency} />
                    <Tooltip 
                      formatter={(value, name) => name === 'price' ? formatCurrency(value) : value}
                      labelFormatter={(value) => `Prediction #${value}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      name="Predicted Price"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="history-table">
                <h4>Recent Predictions</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Price</th>
                      <th>Area (sq ft)</th>
                      <th>Bedrooms</th>
                      <th>Bathrooms</th>
                      <th>Location</th>
                      <th>Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictions.slice(0, 10).map((prediction, index) => (
                      <tr key={index}>
                        <td>{formatDate(prediction.timestamp)}</td>
                        <td>{formatCurrency(prediction.price)}</td>
                        <td>{prediction.input.area}</td>
                        <td>{prediction.input.bedrooms}</td>
                        <td>{prediction.input.bathrooms}</td>
                        <td>{prediction.input.location}</td>
                        <td>{prediction.input.age}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="locations-summary">
                <h4>Average Prices by Location</h4>
                <div className="location-cards">
                  {Object.entries(locationGroups).map(([location, preds]) => {
                    const avgPrice = preds.reduce((sum, p) => sum + p.price, 0) / preds.length;
                    return (
                      <div className="location-card" key={location}>
                        <h5>{location}</h5>
                        <div className="location-price">{formatCurrency(avgPrice)}</div>
                        <div className="location-count">{preds.length} predictions</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          
          <button className="clear-history-btn" onClick={loadPredictions}>
            <i className="fas fa-sync"></i> Refresh History
          </button>
        </div>
      )}
    </div>
  );
};

export default PredictionHistory;
