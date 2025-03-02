import * as brain from 'brain.js';
import dbService from '../services/IndexedDBService';

// Add a unique model identifier for current usage
const DEFAULT_MODEL_ID = 'default-model';

class BrainJsModel {
  constructor() {
    this.model = new brain.NeuralNetwork({
      hiddenLayers: [10, 10],
      activation: 'sigmoid'
    });
    this.isInitialized = false;
    this.retryAttempts = 0;
    this.maxRetries = 3;
    this.modelMetadata = {
      id: DEFAULT_MODEL_ID,
      name: 'Default Model',
      timestamp: Date.now(),
      features: ['area', 'bedrooms', 'bathrooms', 'location', 'age']
    };
  }

  async initialize() {
    try {
      console.log("Initializing model...");
      
      // First try to load model from IndexedDB
      const savedModel = await this.loadModelFromStorage(DEFAULT_MODEL_ID);
      
      if (savedModel) {
        console.log("Model loaded from storage");
        this.isInitialized = true;
        this.modelMetadata = savedModel.metadata;
        return true;
      }
      
      // If no saved model exists, train a new one
      console.log("No saved model found, training new model");
      
      // Attempt to fetch training data
      const response = await fetch('/api/training-data');
      
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. API endpoint may be misconfigured.');
      }

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Training data is empty or invalid');
      }

      // Transform data for brain.js format
      const trainingData = this.prepareTrainingData(data);
      
      // Train the model
      await this.trainModel(trainingData);
      
      // Save the trained model
      await this.saveModelToStorage();
      
      this.isInitialized = true;
      this.retryAttempts = 0;
      console.log("Model initialized successfully");
      return true;
    } catch (error) {
      console.error("Error initializing model:", error);
      
      // Handle retry logic
      if (this.retryAttempts < this.maxRetries) {
        this.retryAttempts++;
        console.log(`Retrying initialization (${this.retryAttempts}/${this.maxRetries})...`);
        return await this.initialize();
      }
      
      this.isInitialized = false;
      throw error;
    }
  }

  // Convert model to serializable format
  serializeModel() {
    try {
      // Brain.js models can be serialized to JSON
      const modelData = this.model.toJSON();
      
      return {
        modelData,
        metadata: this.modelMetadata
      };
    } catch (error) {
      console.error("Error serializing model:", error);
      throw error;
    }
  }

  // Load model from serialized format
  deserializeModel(serializedModel) {
    try {
      if (!serializedModel || !serializedModel.modelData) {
        throw new Error("Invalid serialized model data");
      }
      
      this.model = new brain.NeuralNetwork();
      this.model.fromJSON(serializedModel.modelData);
      
      if (serializedModel.metadata) {
        this.modelMetadata = serializedModel.metadata;
      }
      
      return true;
    } catch (error) {
      console.error("Error deserializing model:", error);
      throw error;
    }
  }

  // Save model to IndexedDB
  async saveModelToStorage(customName = null) {
    try {
      if (!this.isInitialized) {
        throw new Error("Cannot save uninitialized model");
      }
      
      // Update metadata if custom name provided
      if (customName) {
        const modelId = `model-${Date.now()}`;
        this.modelMetadata = {
          ...this.modelMetadata,
          id: modelId,
          name: customName,
          timestamp: Date.now()
        };
      }
      
      const serializedModel = this.serializeModel();
      await dbService.saveModel(serializedModel);
      
      return this.modelMetadata.id;
    } catch (error) {
      console.error("Error saving model:", error);
      throw error;
    }
  }

  // Load model from IndexedDB
  async loadModelFromStorage(modelId) {
    try {
      const serializedModel = await dbService.loadModel(modelId);
      
      if (!serializedModel) {
        return null;
      }
      
      const success = this.deserializeModel(serializedModel);
      return success ? serializedModel : null;
    } catch (error) {
      console.error("Error loading model:", error);
      return null;
    }
  }

  prepareTrainingData(data) {
    // Transform your raw data to the format brain.js expects
    return data.map(item => ({
      input: this.normalizeInput({
        area: item.area,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        location: this.encodeLocation(item.location),
        age: item.age
      }),
      output: { price: this.normalizeOutput(item.price) }
    }));
  }

  async trainModel(trainingData) {
    try {
      console.log("Training model with", trainingData.length, "samples");
      await this.model.trainAsync(trainingData, {
        iterations: 1000,
        errorThresh: 0.01,
        log: true,
        logPeriod: 100
      });
      console.log("Model training complete");
    } catch (error) {
      console.error("Error training model:", error);
      throw new Error("Failed to train model: " + error.message);
    }
  }

  // Normalize input features to a range suitable for neural networks
  normalizeInput(input) {
    return {
      area: input.area / 6000, // Updated for max area of 5800 sq ft
      bedrooms: input.bedrooms / 5,
      bathrooms: input.bathrooms / 5,
      location: input.location, // Already encoded as a number
      age: input.age / 100 // Max age is 100 years
    };
  }

  // Encode categorical location data to numerical values
  encodeLocation(location) {
    // Simple encoding example (you might want to use one-hot encoding instead)
    const locations = {
      'urban': 0.1,
      'suburban': 0.5,
      'rural': 0.9
      // Add more locations as needed
    };
    return locations[location.toLowerCase()] || 0.5; // Default to suburban if not found
  }

  normalizeOutput(price) {
    // Normalize to a range between 0 and 1
    return price / 1000000; // Assuming max price is 1 million
  }

  denormalizeOutput(normalizedPrice) {
    // Convert back to actual price
    return normalizedPrice * 1000000;
  }

  predict(input) {
    if (!this.isInitialized) {
      throw new Error("Model not initialized");
    }

    try {
      const normalizedInput = this.normalizeInput({
        area: input.area,
        bedrooms: input.bedrooms,
        bathrooms: input.bathrooms,
        location: this.encodeLocation(input.location),
        age: input.age
      });

      const output = this.model.run(normalizedInput);
      const predictedPrice = this.denormalizeOutput(output.price);

      return {
        price: Math.round(predictedPrice),
        input: input
      };
    } catch (error) {
      console.error("Prediction error:", error);
      throw new Error("Failed to make prediction: " + error.message);
    }
  }

  // Check if model is ready
  isReady() {
    return this.isInitialized;
  }

  // Additional methods for model management
  async saveAsNewModel(name) {
    return await this.saveModelToStorage(name);
  }
}

// Create a singleton instance
const modelInstance = new BrainJsModel();

// Export functions for using the model
export const initializeModel = async () => {
  try {
    return await modelInstance.initialize();
  } catch (error) {
    console.error("Failed to initialize model:", error);
    throw error;
  }
};

// Add this fallback function for when the model fails
export const makeFallbackPrediction = (input) => {
  // Simple formula-based prediction as fallback
  // This is a very basic calculation - you can make it more sophisticated
  try {
    const { area, bedrooms, bathrooms, location, age } = input;
    
    // Base price per square foot based on location
    const locationFactor = {
      'Downtown': 350,
      'Suburban': 250,
      'Rural': 150
    }[location] || 250;
    
    // Calculate base price from area and location
    let basePrice = area * locationFactor;
    
    // Adjust for bedrooms (each adds 5%)
    const bedroomFactor = 1 + (bedrooms * 0.05);
    
    // Adjust for bathrooms (each adds 7%, including half baths)
    const bathroomFactor = 1 + (bathrooms * 0.07);
    
    // Adjust for age (newer properties are worth more)
    // More gradual decline for older properties
    const ageFactor = Math.max(0.5, 1 - (age * 0.005)); // Minimum 50% of value at 100 years
    
    // Calculate final price
    const price = Math.round(basePrice * bedroomFactor * bathroomFactor * ageFactor);
    
    console.log("Using fallback prediction method");
    
    return {
      price,
      input,
      isFallback: true
    };
  } catch (error) {
    console.error("Error in fallback prediction:", error);
    throw new Error("Unable to calculate property value");
  }
};

// Modify the makePrediction function to store prediction history
export const makePrediction = async (input) => {
  try {
    // Validate inputs to prevent unexpected errors
    if (!input || typeof input !== 'object') {
      throw new Error("Invalid input data provided");
    }
    
    // Ensure all required fields are present
    const requiredFields = ['area', 'bedrooms', 'bathrooms', 'location', 'age'];
    for (const field of requiredFields) {
      if (input[field] === undefined || input[field] === '') {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // If model is not initialized, use fallback
    if (!modelInstance.isReady()) {
      console.warn("Model not initialized, using fallback prediction");
      const result = makeFallbackPrediction(input);
      
      // Store prediction in history with fallback flag
      await storeInPredictionHistory({
        ...result,
        modelId: modelInstance.modelMetadata.id,
        modelName: modelInstance.modelMetadata.name,
        isFallback: true
      });
      
      return result;
    }
    
    // Try using the trained model
    const result = modelInstance.predict(input);
    
    // Store prediction in history
    await storeInPredictionHistory({
      ...result,
      modelId: modelInstance.modelMetadata.id,
      modelName: modelInstance.modelMetadata.name,
      isFallback: false
    });
    
    return result;
  } catch (error) {
    console.error("Prediction error:", error);
    // On any error, try the fallback
    console.warn("Using fallback prediction due to error");
    try {
      const result = makeFallbackPrediction(input);
      
      // Store fallback prediction in history
      await storeInPredictionHistory({
        ...result,
        modelId: "fallback",
        modelName: "Fallback Model",
        isFallback: true,
        error: error.message
      });
      
      return result;
    } catch (fallbackError) {
      throw fallbackError;
    }
  }
};

// Helper function to store predictions
const storeInPredictionHistory = async (predictionData) => {
  try {
    await dbService.savePrediction(predictionData);
  } catch (error) {
    console.error("Failed to store prediction history:", error);
    // Non-critical error, don't throw
  }
};

// Improve the isModelInitialized function to be more reliable
export const isModelInitialized = () => {
  try {
    return modelInstance && modelInstance.isReady();
  } catch (e) {
    console.error("Error checking model initialization:", e);
    return false;
  }
};

// Add new functions for model management
export const saveCurrentModel = async (name) => {
  try {
    return await modelInstance.saveAsNewModel(name);
  } catch (error) {
    console.error("Failed to save model:", error);
    throw error;
  }
};

export const listSavedModels = async () => {
  try {
    return await dbService.listModels();
  } catch (error) {
    console.error("Failed to list models:", error);
    return [];
  }
};

export const loadSavedModel = async (modelId) => {
  try {
    const success = await modelInstance.loadModelFromStorage(modelId);
    return !!success;
  } catch (error) {
    console.error("Failed to load model:", error);
    return false;
  }
};

export const deleteSavedModel = async (modelId) => {
  try {
    return await dbService.deleteModel(modelId);
  } catch (error) {
    console.error("Failed to delete model:", error);
    return false;
  }
};

export const getCurrentModelInfo = () => {
  return modelInstance.modelMetadata;
};

// Function to get model performance metrics
export const getModelPerformanceMetrics = async (modelId) => {
  try {
    const predictions = await dbService.getPredictionsForModel(modelId);
    if (predictions.length === 0) {
      return null;
    }
    
    // Calculate basic metrics
    const totalPredictions = predictions.length;
    const avgPrice = predictions.reduce((sum, p) => sum + p.price, 0) / totalPredictions;
    
    // Group by location
    const locationBreakdown = predictions.reduce((acc, prediction) => {
      const location = prediction.input.location;
      if (!acc[location]) {
        acc[location] = { count: 0, sum: 0 };
      }
      acc[location].count += 1;
      acc[location].sum += prediction.price;
      return acc;
    }, {});
    
    // Calculate location averages
    Object.keys(locationBreakdown).forEach(location => {
      locationBreakdown[location].average = 
        locationBreakdown[location].sum / locationBreakdown[location].count;
    });
    
    return {
      totalPredictions,
      avgPrice,
      locationBreakdown,
      firstPredictionDate: new Date(Math.min(...predictions.map(p => p.timestamp))),
      lastPredictionDate: new Date(Math.max(...predictions.map(p => p.timestamp)))
    };
  } catch (error) {
    console.error("Error getting model metrics:", error);
    return null;
  }
};
