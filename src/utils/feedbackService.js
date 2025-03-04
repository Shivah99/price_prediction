import { openDB } from 'idb';

const DB_NAME = 'price_prediction_db';
const FEEDBACK_STORE = 'user_feedback';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create a store for user feedback if it doesn't exist
      if (!db.objectStoreNames.contains(FEEDBACK_STORE)) {
        const store = db.createObjectStore(FEEDBACK_STORE, { 
          keyPath: 'id',
          autoIncrement: true
        });
        
        // Create indexes for querying
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('rating', 'rating', { unique: false });
      }
    }
  });
};

// Simple service to manage user feedback

// In-memory storage for feedback if IndexedDB is not available
const memoryStorage = {
  feedback: [],
  nextId: 1
};

// Save feedback in memory or localStorage
export const saveFeedback = async (feedbackData) => {
  try {
    // Add an ID and timestamp if not provided
    const completeData = {
      id: memoryStorage.nextId++,
      ...feedbackData,
      timestamp: feedbackData.timestamp || new Date().toISOString()
    };
    
    // Store in memory
    memoryStorage.feedback.push(completeData);
    
    // Try to store in localStorage too (for persistence)
    try {
      const existingFeedback = JSON.parse(localStorage.getItem('feedbackData') || '[]');
      existingFeedback.push(completeData);
      localStorage.setItem('feedbackData', JSON.stringify(existingFeedback));
    } catch (storageError) {
      console.warn('Could not save feedback to localStorage', storageError);
      // Continue with in-memory storage only
    }
    
    console.log('Feedback saved successfully', completeData);
    return true;
  } catch (error) {
    console.error('Failed to save feedback:', error);
    throw error;
  }
};

// Get all feedback (from memory or localStorage)
export const getAllFeedback = async () => {
  try {
    // Try to get from localStorage first for persistence
    try {
      const localData = localStorage.getItem('feedbackData');
      if (localData) {
        const parsedData = JSON.parse(localData);
        // Update memory storage to match localStorage
        memoryStorage.feedback = parsedData;
        return parsedData;
      }
    } catch (storageError) {
      console.warn('Could not retrieve feedback from localStorage', storageError);
    }
    
    // Fall back to memory storage
    return memoryStorage.feedback;
  } catch (error) {
    console.error('Failed to get feedback:', error);
    return [];
  }
};

// Get feedback statistics
export const getFeedbackStats = async () => {
  try {
    const allFeedback = await getAllFeedback();
    
    // Calculate average rating
    const totalRating = allFeedback.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = allFeedback.length > 0 ? totalRating / allFeedback.length : 0;
    
    // Count by rating
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allFeedback.forEach(item => {
      if (ratingCounts[item.rating] !== undefined) {
        ratingCounts[item.rating]++;
      }
    });
    
    return {
      totalFeedback: allFeedback.length,
      averageRating,
      ratingCounts
    };
  } catch (error) {
    console.error('Error calculating feedback stats:', error);
    return {
      totalFeedback: 0,
      averageRating: 0,
      ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }
};
