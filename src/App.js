import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PredictionPage from './components/PredictionPage/PredictionPage';
import ErrorBoundary from './components/ErrorBoundary';
import { initializeModel } from './models/BrainJsModel';
import { logError } from './utils/errorHandlingUtils';
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // Initialize the model when app loads
  useEffect(() => {
    const loadModel = async () => {
      try {
        await initializeModel();
        console.log("Model initialized successfully");
      } catch (error) {
        logError(error, 'Model Initialization');
        console.error("Model initialization failed, using fallback prediction method");
      }
    };
    
    loadModel();
  }, []);

  return (
    <ErrorBoundary>
      <Router basename="/price_prediction">
        <div className="app-container">
          <Switch>
            <Route exact path="/" component={PredictionPage} />
            {/* Add other routes as needed */}
          </Switch>
          
          <footer className="app-footer">
            <div className="container text-center py-3">
              <p className="mb-0">© {new Date().getFullYear()} Real Estate Price Predictor | Powered by Brain.js</p>
            </div>
          </footer>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

