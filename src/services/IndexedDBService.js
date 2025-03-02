const DB_NAME = 'RealEstatePredictorDB';
const DB_VERSION = 2; // Increased version number for schema update
const MODEL_STORE = 'models';
const PREDICTION_STORE = 'predictions';
const SETTINGS_STORE = 'settings';

class IndexedDBService {
  constructor() {
    this.db = null;
    this.initDB();
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error('IndexedDB error:', event.target.error);
        reject('Error opening database');
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('IndexedDB connected successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object store for models if it doesn't exist
        if (!db.objectStoreNames.contains(MODEL_STORE)) {
          const modelStore = db.createObjectStore(MODEL_STORE, { keyPath: 'metadata.id' });
          modelStore.createIndex('name', 'metadata.name', { unique: false });
          modelStore.createIndex('timestamp', 'metadata.timestamp', { unique: false });
          console.log('Model store created');
        }
        
        // Create object store for predictions
        if (!db.objectStoreNames.contains(PREDICTION_STORE)) {
          const predictionStore = db.createObjectStore(PREDICTION_STORE, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          predictionStore.createIndex('timestamp', 'timestamp', { unique: false });
          predictionStore.createIndex('modelId', 'modelId', { unique: false });
          console.log('Prediction store created');
        }
        
        // Create object store for settings
        if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
          const settingsStore = db.createObjectStore(SETTINGS_STORE, { keyPath: 'id' });
          console.log('Settings store created');
        }
      };
    });
  }

  // Model related methods
  async saveModel(model) {
    try {
      await this.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([MODEL_STORE], 'readwrite');
        const store = transaction.objectStore(MODEL_STORE);
        
        const request = store.put(model);
        
        request.onsuccess = () => {
          console.log('Model saved to IndexedDB');
          resolve(true);
        };
        
        request.onerror = (event) => {
          console.error('Error saving model:', event.target.error);
          reject('Failed to save model');
        };
      });
    } catch (error) {
      console.error('IndexedDB save error:', error);
      throw error;
    }
  }

  async loadModel(id) {
    try {
      await this.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([MODEL_STORE], 'readonly');
        const store = transaction.objectStore(MODEL_STORE);
        
        const request = store.get(id);
        
        request.onsuccess = (event) => {
          if (event.target.result) {
            console.log('Model loaded from IndexedDB');
            resolve(event.target.result);
          } else {
            console.log('Model not found in IndexedDB');
            resolve(null);
          }
        };
        
        request.onerror = (event) => {
          console.error('Error loading model:', event.target.error);
          reject('Failed to load model');
        };
      });
    } catch (error) {
      console.error('IndexedDB load error:', error);
      throw error;
    }
  }

  async deleteModel(id) {
    try {
      await this.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([MODEL_STORE], 'readwrite');
        const store = transaction.objectStore(MODEL_STORE);
        
        const request = store.delete(id);
        
        request.onsuccess = () => {
          console.log('Model deleted from IndexedDB');
          resolve(true);
        };
        
        request.onerror = (event) => {
          console.error('Error deleting model:', event.target.error);
          reject('Failed to delete model');
        };
      });
    } catch (error) {
      console.error('IndexedDB delete error:', error);
      throw error;
    }
  }

  async listModels() {
    try {
      await this.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([MODEL_STORE], 'readonly');
        const store = transaction.objectStore(MODEL_STORE);
        const index = store.index('timestamp');
        
        const request = index.openCursor(null, 'prev'); // Sort by timestamp descending
        const models = [];
        
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            models.push(cursor.value);
            cursor.continue();
          } else {
            resolve(models);
          }
        };
        
        request.onerror = (event) => {
          console.error('Error listing models:', event.target.error);
          reject('Failed to list models');
        };
      });
    } catch (error) {
      console.error('IndexedDB list error:', error);
      throw error;
    }
  }
  
  // Prediction history related methods
  async savePrediction(prediction) {
    try {
      await this.initDB();
      
      const predictionData = {
        ...prediction,
        timestamp: Date.now()
      };
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([PREDICTION_STORE], 'readwrite');
        const store = transaction.objectStore(PREDICTION_STORE);
        
        const request = store.add(predictionData);
        
        request.onsuccess = (event) => {
          console.log('Prediction saved to IndexedDB');
          resolve(event.target.result); // Returns the ID
        };
        
        request.onerror = (event) => {
          console.error('Error saving prediction:', event.target.error);
          reject('Failed to save prediction');
        };
      });
    } catch (error) {
      console.error('IndexedDB save prediction error:', error);
      throw error;
    }
  }
  
  async getPredictionHistory(limit = 20) {
    try {
      await this.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([PREDICTION_STORE], 'readonly');
        const store = transaction.objectStore(PREDICTION_STORE);
        const index = store.index('timestamp');
        
        const request = index.openCursor(null, 'prev'); // Most recent first
        const predictions = [];
        
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor && predictions.length < limit) {
            predictions.push(cursor.value);
            cursor.continue();
          } else {
            resolve(predictions);
          }
        };
        
        request.onerror = (event) => {
          console.error('Error getting predictions:', event.target.error);
          reject('Failed to get predictions');
        };
      });
    } catch (error) {
      console.error('IndexedDB get predictions error:', error);
      throw error;
    }
  }
  
  async getPredictionsForModel(modelId, limit = 50) {
    try {
      await this.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([PREDICTION_STORE], 'readonly');
        const store = transaction.objectStore(PREDICTION_STORE);
        const index = store.index('modelId');
        
        const request = index.openCursor(IDBKeyRange.only(modelId));
        const predictions = [];
        
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor && predictions.length < limit) {
            predictions.push(cursor.value);
            cursor.continue();
          } else {
            resolve(predictions);
          }
        };
        
        request.onerror = (event) => {
          console.error('Error getting model predictions:', event.target.error);
          reject('Failed to get model predictions');
        };
      });
    } catch (error) {
      console.error('IndexedDB get model predictions error:', error);
      throw error;
    }
  }
  
  // Settings related methods
  async saveSetting(key, value) {
    try {
      await this.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([SETTINGS_STORE], 'readwrite');
        const store = transaction.objectStore(SETTINGS_STORE);
        
        const setting = { id: key, value };
        const request = store.put(setting);
        
        request.onsuccess = () => {
          console.log('Setting saved to IndexedDB');
          resolve(true);
        };
        
        request.onerror = (event) => {
          console.error('Error saving setting:', event.target.error);
          reject('Failed to save setting');
        };
      });
    } catch (error) {
      console.error('IndexedDB save setting error:', error);
      throw error;
    }
  }
  
  async getSetting(key, defaultValue = null) {
    try {
      await this.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([SETTINGS_STORE], 'readonly');
        const store = transaction.objectStore(SETTINGS_STORE);
        
        const request = store.get(key);
        
        request.onsuccess = (event) => {
          const result = event.target.result;
          if (result) {
            resolve(result.value);
          } else {
            resolve(defaultValue);
          }
        };
        
        request.onerror = (event) => {
          console.error('Error getting setting:', event.target.error);
          reject('Failed to get setting');
        };
      });
    } catch (error) {
      console.error('IndexedDB get setting error:', error);
      return defaultValue;
    }
  }
}

// Create and export a singleton instance
const dbService = new IndexedDBService();
export default dbService;
