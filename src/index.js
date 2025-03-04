import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Using basename for GitHub Pages deployment
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/price_prediction">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
