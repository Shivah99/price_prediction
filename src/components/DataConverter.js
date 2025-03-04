import React, { useState, useEffect } from 'react';
import DataHandler from '../utils/DataHandler';
import * as XLSX from 'xlsx';

const DataConverter = () => {
  const [jsonData, setJsonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState(null);

  // Try to load existing data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await DataHandler.loadJsonData();
        setJsonData(data);
        const stats = DataHandler.getDataStatistics(data);
        setStatistics(stats);
        setIsLoading(false);
      } catch (err) {
        console.log('No pre-converted data found. You can upload an Excel file instead.');
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    DataHandler.convertExcelFileToJson(
      file,
      (data) => {
        setJsonData(data);
        setStatistics(DataHandler.getDataStatistics(data));
      },
      setError,
      setIsLoading
    );
  };

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h2>Excel to JSON Converter</h2>
      </div>
      <div className="card-body">
        {/* File Upload Section */}
        <div className="mb-4">
          <p>Upload an Excel file to convert it to JSON format:</p>
          <input 
            type="file" 
            className="form-control" 
            accept=".xlsx, .xls" 
            onChange={handleFileUpload} 
          />
        </div>
        
        {/* Loading and Error States */}
        {isLoading && (
          <div className="alert alert-info">Processing file...</div>
        )}
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        {/* Data Statistics Section */}
        {statistics && (
          <div className="mb-4">
            <h3>Dataset Statistics</h3>
            <div className="row">
              <div className="col-md-6">
                <div className="card mb-2">
                  <div className="card-body">
                    <h5>General Information</h5>
                    <p><strong>Total Records:</strong> {statistics.count}</p>
                    <p><strong>Average Price:</strong> ${statistics.averagePrice.toLocaleString()} thousand</p>
                    <p><strong>Average Size:</strong> {statistics.averageSize.toLocaleString()} sq ft</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card mb-2">
                  <div className="card-body">
                    <h5>Location Breakdown</h5>
                    <ul>
                      {Object.entries(statistics.locationBreakdown).map(([location, count]) => (
                        <li key={location}>
                          <strong>{location}:</strong> {count} properties ({(count / statistics.count * 100).toFixed(1)}%)
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* JSON Data Output */}
        {jsonData && (
          <div>
            <h3>JSON Data ({jsonData.length} records):</h3>
            <div className="alert alert-success">
              JSON data has been generated and downloaded automatically.
            </div>
            <div style={{maxHeight: '400px', overflow: 'auto'}}>
              <pre className="bg-light p-3 border">
                {JSON.stringify(jsonData.slice(0, 5), null, 2)}
                {jsonData.length > 5 && <div className="text-muted mt-2">...and {jsonData.length - 5} more records</div>}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataConverter;

/**
 * Converts JSON data to Excel file and triggers download
 * 
 * @param {Array} data - Array of objects to convert
 * @param {String} filename - Name of the file to download
 * @param {String} sheetName - Name of the Excel sheet
 */
export const convertToExcel = (data, filename = 'prediction-data', sheetName = 'Predictions') => {
  // Create worksheet from data
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Create workbook and append the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // Generate Excel file and trigger download
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

/**
 * Converts Excel file to JSON
 * 
 * @param {File} file - Excel file to convert
 * @returns {Promise} - Resolves with parsed data
 */
export const convertExcelToJson = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Normalizes data for neural network input
 * 
 * @param {Object} data - Raw property data
 * @returns {Object} - Normalized data ready for model input
 */
export const normalizeData = (data) => {
  // Simple normalization example - expand as needed for your model
  return {
    area: Number(data.area) / 5000, // Assuming max area is 5000 sq ft
    bedrooms: Number(data.bedrooms) / 5, // Assuming max is 5 bedrooms
    bathrooms: Number(data.bathrooms) / 3, // Assuming max is 3 bathrooms
    location: data.location === 'urban' ? 1 : data.location === 'suburban' ? 0.5 : 0,
    age: Math.min(Number(data.age), 50) / 50, // Cap at 50 years, normalize
  };
};

/**
 * Denormalizes model output back to human-readable format
 * 
 * @param {Number} normalizedPrice - Price prediction from model (0-1 range)
 * @returns {Number} - Actual price estimate
 */
export const denormalizePrice = (normalizedPrice) => {
  // Assuming model output is normalized to 0-1 and max price is $2M
  return Math.round(normalizedPrice * 2000000);
};
