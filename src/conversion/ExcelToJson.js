import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Import local JSON if available (this might not work with create-react-app's limitations)
// If it doesn't work, use the useRealEstateData hook from utils instead
let localJsonData = [];
try {
  localJsonData = require('./converted.json');
} catch (e) {
  console.log('No pre-converted data found locally');
}

const ExcelToJson = () => {
  const [jsonData, setJsonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Function to handle file upload via UI
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsLoading(true);
    setError(null);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Get first sheet name
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON
        const parsedData = XLSX.utils.sheet_to_json(sheet);

        // Update state
        setJsonData(parsedData);
        setIsLoading(false);

        // Convert JSON to Blob and trigger download
        const jsonBlob = new Blob([JSON.stringify(parsedData, null, 2)], {
          type: "application/json",
        });
        saveAs(jsonBlob, "real_estate_data.json");
      } catch (err) {
        setError(`Error processing file: ${err.message}`);
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Error reading file');
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };
  
  // Attempt to load pre-converted JSON data when component mounts
  useEffect(() => {
    if (localJsonData && localJsonData.length > 0) {
      setJsonData(localJsonData);
      return;
    }
    
    const fetchData = async () => {
      try {
        // This will only work if you've already run the convertExcel.js script
        // and the file exists in public folder or has been imported
        const response = await fetch('/real_estate_dataset.json');
        if (!response.ok) {
          throw new Error('Failed to load pre-converted data');
        }
        const data = await response.json();
        setJsonData(data);
      } catch (err) {
        console.log('No pre-converted data found. You can upload an Excel file instead.');
      }
    };
    
    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Excel to JSON Converter</h2>
      
      <div className="mb-4">
        <p>Upload an Excel file to convert it to JSON format:</p>
        <input 
          type="file" 
          className="form-control" 
          accept=".xlsx, .xls" 
          onChange={handleFileUpload} 
        />
      </div>
      
      {isLoading && (
        <div className="alert alert-info">Processing file...</div>
      )}
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      {jsonData && (
        <div>
          <h3>JSON Output ({jsonData.length} records):</h3>
          <div className="alert alert-success">
            JSON data has been generated and downloaded automatically.
          </div>
          <div style={{maxHeight: '400px', overflow: 'auto'}}>
            <pre style={{ background: "#f4f4f4", padding: "10px" }}>
              {JSON.stringify(jsonData.slice(0, 10), null, 2)}
              {jsonData.length > 10 && <div className="text-muted">...and {jsonData.length - 10} more records</div>}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelToJson;
