import React, { useState, useEffect } from 'react';
import DataHandler from '../utils/DataHandler';

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
