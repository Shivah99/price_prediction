import React from 'react';
import { displayErrorMessage } from '../utils/errorHandlingUtils';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log the error
    console.error('Error caught by boundary:', error, errorInfo);

    // Display a user-friendly message
    displayErrorMessage('Something went wrong. The application will continue to work but some features may be limited.');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container p-4 m-3 border border-danger rounded">
          <h3 className="text-danger">Something went wrong</h3>
          <p>The application encountered an error but will continue running with limited functionality.</p>
          <button 
            className="btn btn-primary mt-2" 
            onClick={() => window.location.reload()}
          >
            Reload Application
          </button>
          {this.props.children}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
