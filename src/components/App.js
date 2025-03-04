import React, { useState, useEffect } from 'react';
import DataInputForm from './DataInputForm';
import PredictionResult from './PredictionResult';
import PredictionChart from './PredictionChart';
import ModelManager from './ModelManager';
import { initializeModel, makePrediction } from '../models/BrainJsModel';
import '../styles/App.css';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModel, setActiveModel] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      setIsModelLoading(true);
      setError(null);
      
      try {
        await initializeModel();
        setIsModelLoading(false);
      } catch (err) {
        console.error("Model initialization failed:", err);
        setIsModelLoading(false);
        setError("Failed to load prediction model. Please reload the page or try again later.");
      }
    };
    
    loadModel();
  }, []);

  const handlePrediction = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert numeric strings to numbers if needed
      const processedData = {
        area: Number(formData.area),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        location: formData.location,
        age: Number(formData.age)
      };
      
      // Make prediction with properly processed data
      const result = await makePrediction(processedData);
      setPrediction(result);
      
      // Remove fallback notice
    } catch (err) {
      console.error("Prediction error:", err);
      setError("Error making prediction. Please check your inputs and try again.");
      setPrediction(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (modelInfo) => {
    setActiveModel(modelInfo);
    // Optional: You could also reset the prediction when the model changes
    setPrediction(null);
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Real Estate Price Predictor</h1>
        <p>Get accurate property valuations using machine learning</p>
      </header>
      
      <main className="app-content">
        <div className="content-wrapper">
          <div className="form-container">
            <DataInputForm 
              onSubmit={handlePrediction} 
              disabled={isModelLoading || isLoading}
            />
          </div>
          <div className="result-container">
            <PredictionResult 
              prediction={prediction} 
              isLoading={isLoading} 
              isModelLoading={isModelLoading}
              error={error}
              modelName={activeModel ? activeModel.name : null}
            />
          </div>
        </div>
        
        {/* Add model manager */}
        <ModelManager onModelChange={handleModelChange} />
        
        {/* Existing chart component */}
        {prediction && !isLoading && (
          <PredictionChart newPrediction={prediction} />
        )}
      </main>
      
      <footer className="app-footer">
        <p>© 2023 Real Estate Price Predictor | Powered by Brain.js</p>
      </footer>
    </div>
  );
}

// Update any repository references from Price_Prediction to price_prediction

export default App;
