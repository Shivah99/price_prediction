import React, { useState, useEffect } from 'react';
import DataInputForm from './components/DataInputForm';
import PredictionResult from './components/PredictionResult';
import { trainModel, makePrediction } from './utils/BrainJsModel';
import './styles/App.css';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(true);

  // Load and train the model on component mount
  useEffect(() => {
    const initializeModel = async () => {
      try {
        const trainedModel = await trainModel();
        setModel(trainedModel);
        setIsModelLoading(false);
      } catch (error) {
        console.error("Error initializing model:", error);
        setIsModelLoading(false);
      }
    };
    
    initializeModel();
  }, []);

  const handlePrediction = async (formData) => {
    setIsLoading(true);
    try {
      const result = await makePrediction(model, formData);
      setPrediction(result);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Error making prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Real Estate Price Predictor</h1>
        <p>Predict property prices using neural network technology</p>
      </header>
      
      <main className="app-main">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <DataInputForm 
                onSubmit={handlePrediction} 
                isLoading={isLoading || isModelLoading} 
              />
            </div>
            <div className="col-md-6">
              <PredictionResult 
                prediction={prediction} 
                isLoading={isLoading} 
                isModelLoading={isModelLoading} 
              />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <p>© 2023 Real Estate Price Predictor | Powered by React & Brain.js</p>
      </footer>
    </div>
  );
}

export default App;

