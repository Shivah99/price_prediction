import * as brain from 'brain.js';
// Remove unused import
// import dataHandler from './DataHandler';

// Configuration for the neural network
const netConfig = {
  hiddenLayers: [8, 4], // Two hidden layers with 8 and 4 neurons
  activation: 'sigmoid',
  iterations: 20000,
  learningRate: 0.005,
  errorThresh: 0.005
};

// Helper function to normalize a value between 0 and 1
const normalize = (value, min, max) => {
  if (max === min) return 0.5;
  return (value - min) / (max - min);
};

// Helper function to denormalize a value
const denormalize = (normalized, min, max) => {
  return normalized * (max - min) + min;
};

// Data ranges for normalization/denormalization based on the converted.json format
const dataRanges = {
  area: { min: 500, max: 5000 },
  bedrooms: { min: 1, max: 5 },
  bathrooms: { min: 1, max: 3 },
  age: { min: 1, max: 50 },
  price: { min: 300, max: 1200 } // Price in $1000
};

// Maps location to a numeric value for the neural network
const locationMap = {
  "Downtown": 0.9,
  "Suburban": 0.6,
  "Rural": 0.3
};

// Prepare data for training from the converted.json format
const prepareTrainingData = (data) => {
  return data.map(item => ({
    input: {
      area: normalize(item["Area (sq ft)"], dataRanges.area.min, dataRanges.area.max),
      bedrooms: normalize(item["Bedrooms"], dataRanges.bedrooms.min, dataRanges.bedrooms.max),
      bathrooms: normalize(item["Bathrooms"], dataRanges.bathrooms.min, dataRanges.bathrooms.max),
      location: locationMap[item["Location"]] || 0.5, // Default to 0.5 if location not found
      age: normalize(item["Age of Property (years)"], dataRanges.age.min, dataRanges.age.max)
    },
    output: {
      price: normalize(item["Price (in $1000)"], dataRanges.price.min, dataRanges.price.max)
    }
  }));
};

// Prepare a single input for prediction
const prepareInput = (inputData) => {
  return {
    area: normalize(inputData.area, dataRanges.area.min, dataRanges.area.max),
    bedrooms: normalize(inputData.bedrooms, dataRanges.bedrooms.min, dataRanges.bedrooms.max),
    bathrooms: normalize(inputData.bathrooms, dataRanges.bathrooms.min, dataRanges.bathrooms.max),
    location: locationMap[inputData.location] || 0.5,
    age: normalize(inputData.age, dataRanges.age.min, dataRanges.age.max)
  };
};

// Train the neural network
export const trainModel = async () => {
  try {
    // Load data from converted.json
    const response = await fetch('/src/conversion/converted.json');
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    
    if (!data || data.length === 0) {
      throw new Error("No data available for training");
    }
    
    const trainingData = prepareTrainingData(data);
    
    const net = new brain.NeuralNetwork(netConfig);
    net.train(trainingData);
    
    console.log("Model trained successfully!");
    return net;
  } catch (error) {
    console.error("Error training model:", error);
    throw error;
  }
};

// Make a prediction using the trained model
export const makePrediction = async (model, inputData) => {
  if (!model) {
    throw new Error("Model not initialized");
  }
  
  const input = prepareInput(inputData);
  const output = model.run(input);
  
  // Denormalize the predicted price
  const predictedPrice = denormalize(
    output.price,
    dataRanges.price.min,
    dataRanges.price.max
  );
  
  return {
    price: Math.round(predictedPrice * 1000), // Convert back from ($1000) to $ 
    input: inputData
  };
};
