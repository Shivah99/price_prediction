import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Comprehensive Data Handler for Excel/JSON conversion and data management
 * This single file replaces multiple conversion-related files
 */
class DataHandler {
  constructor() {
    this.dataPath = '/src/conversion/converted.json';
    this.cachedData = null;
  }

  // Store the JSON data after conversion
  static jsonData = null;
  static isLoading = false;
  static error = null;

  /**
   * Convert Excel file to JSON using browser File API (for React components)
   * @param {File} file - Excel file from file input
   * @param {Function} onSuccess - Callback with the resulting JSON data
   * @param {Function} onError - Callback with any error
   * @param {Function} onLoading - Callback with loading state
   */
  static convertExcelFileToJson = (file, onSuccess, onError, onLoading) => {
    if (!file) {
      onError?.('No file provided');
      return;
    }

    onLoading?.(true);
    this.isLoading = true;
    this.error = null;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        
        // Save for later use
        this.jsonData = parsedData;
        
        // Create downloadable JSON
        const jsonBlob = new Blob([JSON.stringify(parsedData, null, 2)], {
          type: "application/json",
        });
        
        // Auto-download
        saveAs(jsonBlob, "real_estate_data.json");
        
        // Report success
        onSuccess?.(parsedData);
        onLoading?.(false);
        this.isLoading = false;
      } catch (err) {
        const errorMsg = `Error processing file: ${err.message}`;
        onError?.(errorMsg);
        onLoading?.(false);
        this.error = errorMsg;
        this.isLoading = false;
      }
    };

    reader.onerror = () => {
      const errorMsg = 'Error reading file';
      onError?.(errorMsg);
      onLoading?.(false);
      this.error = errorMsg;
      this.isLoading = false;
    };

    reader.readAsArrayBuffer(file);
  };

  /**
   * Load data from a previously converted JSON file (stored in public folder)
   * @param {string} jsonPath - Path to the JSON file
   * @returns {Promise<Object[]>} - Promise resolving to the loaded JSON data
   */
  static loadJsonData = async (jsonPath = '/real_estate_dataset.json') => {
    try {
      const response = await fetch(jsonPath);
      if (!response.ok) {
        throw new Error(`Failed to load JSON data from ${jsonPath}`);
      }
      const data = await response.json();
      this.jsonData = data;
      return data;
    } catch (err) {
      console.error('Error loading JSON data:', err);
      throw err;
    }
  };

  /**
   * Normalize data for machine learning
   * @param {Object[]} data - Raw data array
   * @returns {Object} - Object with normalized data and normalization factors
   */
  static normalizeData = (data) => {
    if (!data || data.length === 0) return null;

    // Find min and max values for each numeric property
    const numericFields = ['Area (sq ft)', 'Bedrooms', 'Bathrooms', 'Age of Property (years)', 'Price (in $1000)'];
    const normFactors = {};

    numericFields.forEach(field => {
      const values = data.map(item => item[field]);
      normFactors[field] = {
        min: Math.min(...values),
        max: Math.max(...values)
      };
    });

    // Normalize data
    const normalizedData = data.map(item => {
      const normalized = {};
      
      // Normalize numeric fields
      numericFields.forEach(field => {
        const { min, max } = normFactors[field];
        normalized[field] = (item[field] - min) / (max - min);
      });
      
      // Handle categorical fields (like Location)
      if (item['Location']) {
        // One-hot encoding for location
        normalized['Location_Downtown'] = item['Location'] === 'Downtown' ? 1 : 0;
        normalized['Location_Suburban'] = item['Location'] === 'Suburban' ? 1 : 0;
        normalized['Location_Rural'] = item['Location'] === 'Rural' ? 1 : 0;
      }
      
      return normalized;
    });

    return { normalizedData, normFactors };
  };

  /**
   * Denormalize a single prediction
   * @param {number} normalizedValue - Normalized prediction value
   * @param {string} field - Field name to denormalize
   * @param {Object} normFactors - Normalization factors
   * @returns {number} - Denormalized value
   */
  static denormalizeValue = (normalizedValue, field, normFactors) => {
    if (!normFactors || !normFactors[field]) return normalizedValue;
    
    const { min, max } = normFactors[field];
    return normalizedValue * (max - min) + min;
  };

  /**
   * Get formatted dataset for training neural network
   * @param {Object[]} data - Raw data array 
   * @returns {Object} - Data formatted for neural network training
   */
  static prepareTrainingData = (data) => {
    if (!data) {
      // Try to use cached data
      data = this.jsonData;
      if (!data) return null;
    }

    const { normalizedData, normFactors } = this.normalizeData(data);
    
    const trainingData = normalizedData.map(item => ({
      input: {
        area: item['Area (sq ft)'],
        bedrooms: item['Bedrooms'],
        bathrooms: item['Bathrooms'],
        age: item['Age of Property (years)'],
        locationDowntown: item['Location_Downtown'],
        locationSuburban: item['Location_Suburban'],
        locationRural: item['Location_Rural']
      },
      output: {
        price: item['Price (in $1000)']
      }
    }));

    return { trainingData, normFactors };
  };

  /**
   * Get statistics about the data
   * @param {Object[]} data - Dataset to analyze
   * @returns {Object} - Statistical information
   */
  static getDataStatistics = (data) => {
    if (!data || data.length === 0) return null;
    
    const stats = {
      count: data.length,
      locationBreakdown: {},
      averagePrice: 0,
      averageSize: 0,
      priceRange: { min: Infinity, max: -Infinity },
      sizeRange: { min: Infinity, max: -Infinity }
    };
    
    let totalPrice = 0;
    let totalSize = 0;
    
    data.forEach(item => {
      // Location breakdown
      const location = item['Location'];
      stats.locationBreakdown[location] = (stats.locationBreakdown[location] || 0) + 1;
      
      // Price stats
      const price = item['Price (in $1000)'];
      totalPrice += price;
      stats.priceRange.min = Math.min(stats.priceRange.min, price);
      stats.priceRange.max = Math.max(stats.priceRange.max, price);
      
      // Size stats
      const size = item['Area (sq ft)'];
      totalSize += size;
      stats.sizeRange.min = Math.min(stats.sizeRange.min, size);
      stats.sizeRange.max = Math.max(stats.sizeRange.max, size);
    });
    
    stats.averagePrice = totalPrice / data.length;
    stats.averageSize = totalSize / data.length;
    
    return stats;
  }

  async loadData() {
    // If we already loaded the data, return the cached version
    if (this.cachedData) {
      return this.cachedData;
    }

    try {
      // Fetch the JSON data file
      const response = await fetch(this.dataPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Process the data to ensure all numeric values are actually numbers
      const processedData = data.map(item => ({
        area: parseFloat(item.area || 0),
        bedrooms: parseInt(item.bedrooms || 0, 10),
        bathrooms: parseFloat(item.bathrooms || 0),
        location: item.location || "Unknown",
        age: parseInt(item.age || 0, 10),
        price: parseFloat(item.price || 0)
      }));
      
      // Cache the processed data
      this.cachedData = processedData;
      
      console.log(`Loaded ${processedData.length} data points`);
      return processedData;
      
    } catch (error) {
      console.error("Error loading data:", error);
      
      // Return some dummy data for testing if the real data fails to load
      return this.getDummyData();
    }
  }

  getDummyData() {
    console.warn("Using dummy data for testing");
    return [
      { area: 1500, bedrooms: 3, bathrooms: 2, location: "New York", age: 15, price: 450000 },
      { area: 2200, bedrooms: 4, bathrooms: 2.5, location: "Los Angeles", age: 7, price: 750000 },
      { area: 1800, bedrooms: 3, bathrooms: 2, location: "Chicago", age: 20, price: 320000 },
      { area: 900, bedrooms: 1, bathrooms: 1, location: "Houston", age: 5, price: 180000 },
      { area: 3000, bedrooms: 5, bathrooms: 3, location: "New York", age: 2, price: 1200000 },
      { area: 1600, bedrooms: 3, bathrooms: 2, location: "Phoenix", age: 12, price: 295000 },
      { area: 2400, bedrooms: 4, bathrooms: 3, location: "Philadelphia", age: 8, price: 520000 },
      { area: 1100, bedrooms: 2, bathrooms: 1, location: "San Antonio", age: 22, price: 210000 },
      { area: 2800, bedrooms: 4, bathrooms: 3.5, location: "San Diego", age: 3, price: 950000 },
      { area: 1750, bedrooms: 3, bathrooms: 2, location: "Dallas", age: 18, price: 380000 }
    ];
  }
}

// Create and export an instance
const dataHandler = new DataHandler();
export default dataHandler;
