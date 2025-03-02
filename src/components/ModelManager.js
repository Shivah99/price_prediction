import React, { useState, useEffect } from 'react';
import { 
  listSavedModels, 
  loadSavedModel, 
  deleteSavedModel, 
  saveCurrentModel,
  getCurrentModelInfo,
  getModelPerformanceMetrics
} from '../models/BrainJsModel';
import '../styles/ModelManager.css';

const ModelManager = ({ onModelChange }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState(null);
  const [newModelName, setNewModelName] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [metrics, setMetrics] = useState(null);

  const loadModels = async () => {
    setLoading(true);
    try {
      const savedModels = await listSavedModels();
      setModels(savedModels);
      
      // Get current model info
      const currentInfo = getCurrentModelInfo();
      setCurrentModel(currentInfo);
    } catch (error) {
      console.error("Error loading models:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadModelMetrics = async (modelId) => {
    try {
      const modelMetrics = await getModelPerformanceMetrics(modelId);
      setMetrics(modelMetrics);
    } catch (error) {
      console.error("Error loading model metrics:", error);
    }
  };

  useEffect(() => {
    loadModels();
    
    // Load metrics if we have a current model
    if (currentModel) {
      loadModelMetrics(currentModel.id);
    }
  }, []);

  const handleLoadModel = async (modelId) => {
    setLoading(true);
    try {
      const success = await loadSavedModel(modelId);
      if (success) {
        // Update the current model info
        const currentInfo = getCurrentModelInfo();
        setCurrentModel(currentInfo);
        
        // Load metrics for the newly loaded model
        loadModelMetrics(modelId);
        
        // Notify parent component
        if (onModelChange) {
          onModelChange(currentInfo);
        }
      }
    } catch (error) {
      console.error("Error loading model:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModel = async (modelId) => {
    if (window.confirm('Are you sure you want to delete this model?')) {
      setLoading(true);
      try {
        await deleteSavedModel(modelId);
        // Refresh model list
        loadModels();
      } catch (error) {
        console.error("Error deleting model:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveModel = async (e) => {
    e.preventDefault();
    if (!newModelName.trim()) {
      alert('Please enter a model name');
      return;
    }
    
    setLoading(true);
    try {
      await saveCurrentModel(newModelName);
      setNewModelName('');
      // Refresh model list
      loadModels();
    } catch (error) {
      console.error("Error saving model:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className={`model-manager ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="model-manager-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>
          <i className="fas fa-brain"></i> Model Management
          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} toggle-icon`}></i>
        </h3>
        {!isExpanded && currentModel && (
          <div className="current-model-badge">
            <span>Current: {currentModel.name}</span>
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="model-manager-content">
          {loading && <div className="model-loading">Loading...</div>}
          
          <div className="current-model">
            <h4>Current Model</h4>
            {currentModel && (
              <>
                <div className="model-info">
                  <div className="model-name">{currentModel.name}</div>
                  <div className="model-date">{formatDate(currentModel.timestamp)}</div>
                </div>
                
                {metrics && (
                  <div className="model-metrics">
                    <h5>Model Performance</h5>
                    <div className="metrics-grid">
                      <div className="metric-item">
                        <div className="metric-label">Total Predictions</div>
                        <div className="metric-value">{metrics.totalPredictions}</div>
                      </div>
                      
                      <div className="metric-item">
                        <div className="metric-label">Average Price</div>
                        <div className="metric-value">{formatCurrency(metrics.avgPrice)}</div>
                      </div>
                      
                      <div className="metric-item">
                        <div className="metric-label">First Used</div>
                        <div className="metric-value">
                          {metrics.firstPredictionDate?.toLocaleDateString() || 'N/A'}
                        </div>
                      </div>
                      
                      <div className="metric-item">
                        <div className="metric-label">Last Used</div>
                        <div className="metric-value">
                          {metrics.lastPredictionDate?.toLocaleDateString() || 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    {metrics.locationBreakdown && (
                      <div className="location-breakdown">
                        <h6>Location Breakdown</h6>
                        <div className="location-metrics">
                          {Object.entries(metrics.locationBreakdown).map(([location, data]) => (
                            <div className="location-metric-item" key={location}>
                              <span className="location-name">{location}</span>
                              <span className="location-count">{data.count} predictions</span>
                              <span className="location-avg">{formatCurrency(data.average)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          
          <form className="save-model-form" onSubmit={handleSaveModel}>
            <h4>Save Current Model</h4>
            <div className="form-row">
              <input
                type="text"
                placeholder="Enter model name"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading || !newModelName.trim()}>
                <i className="fas fa-save"></i> Save
              </button>
            </div>
          </form>
          
          <div className="saved-models">
            <h4>Saved Models</h4>
            {models.length === 0 ? (
              <div className="no-models">No saved models found</div>
            ) : (
              <ul>
                {models.map(model => (
                  <li key={model.metadata.id}>
                    <div className="model-info">
                      <div className="model-name">{model.metadata.name}</div>
                      <div className="model-date">{formatDate(model.metadata.timestamp)}</div>
                    </div>
                    <div className="model-actions">
                      <button 
                        onClick={() => handleLoadModel(model.metadata.id)}
                        disabled={loading || currentModel?.id === model.metadata.id}
                      >
                        <i className="fas fa-download"></i>
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteModel(model.metadata.id)}
                        disabled={loading}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelManager;
