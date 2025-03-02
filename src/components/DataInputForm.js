import React, { useState } from 'react';
import '../styles/DataInputForm.css';

// Location options based on the converted.json data
const locationOptions = ["Downtown", "Suburban", "Rural"];

const DataInputForm = ({ onSubmit, disabled }) => {
  const [formData, setFormData] = useState({
    area: '',
    bedrooms: '',
    bathrooms: '',
    location: '',
    age: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.area) {
      formErrors.area = "Area is required";
      isValid = false;
    } else if (formData.area < 450) {
      formErrors.area = "Area must be at least 450 sq ft";
      isValid = false;
    } else if (formData.area > 5800) {
      formErrors.area = "Area cannot exceed 5800 sq ft";
      isValid = false;
    }

    if (!formData.bedrooms) {
      formErrors.bedrooms = "Number of bedrooms is required";
      isValid = false;
    } else if (formData.bedrooms <= 0) {
      formErrors.bedrooms = "Bedrooms must be greater than 0";
      isValid = false;
    } else if (formData.bedrooms > 5) {
      formErrors.bedrooms = "Bedrooms cannot exceed 5";
      isValid = false;
    }

    if (!formData.bathrooms) {
      formErrors.bathrooms = "Number of bathrooms is required";
      isValid = false;
    } else if (formData.bathrooms < 1) {
      formErrors.bathrooms = "Bathrooms must be at least 1";
      isValid = false;
    } else if (formData.bathrooms > 5) {
      formErrors.bathrooms = "Bathrooms cannot exceed 5";
      isValid = false;
    }

    if (!formData.location) {
      formErrors.location = "Location is required";
      isValid = false;
    }

    if (!formData.age && formData.age !== 0) {
      formErrors.age = "Property age is required";
      isValid = false;
    } else if (formData.age < 0) {
      formErrors.age = "Age cannot be negative";
      isValid = false;
    } else if (formData.age > 100) {
      formErrors.age = "Age cannot exceed 100 years";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'location' ? value : (value === '' ? '' : Number(value))
    }));
    
    // Clear error for this field when user makes changes
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="input-form-container">
      <h2>Property Details</h2>
      <p>Enter the details of the property to get a price prediction</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="area">
            <i className="fas fa-vector-square"></i> Area (sq ft)
          </label>
          <input
            type="number"
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className={errors.area ? "is-invalid" : ""}
            disabled={disabled}
            min="450"
            max="5800"
            placeholder="Enter property area"
          />
          {errors.area && <div className="invalid-feedback">{errors.area}</div>}
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="bedrooms">
              <i className="fas fa-bed"></i> Bedrooms
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className={errors.bedrooms ? "is-invalid" : ""}
              disabled={disabled}
              min="1"
              max="5"
              placeholder="Number of bedrooms"
            />
            {errors.bedrooms && <div className="invalid-feedback">{errors.bedrooms}</div>}
          </div>

          <div className="form-group half">
            <label htmlFor="bathrooms">
              <i className="fas fa-bath"></i> Bathrooms
            </label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className={errors.bathrooms ? "is-invalid" : ""}
              disabled={disabled}
              step="0.5"
              min="1"
              max="5"
              placeholder="Number of bathrooms"
            />
            {errors.bathrooms && <div className="invalid-feedback">{errors.bathrooms}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location">
            <i className="fas fa-map-marker-alt"></i> Location
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            disabled={disabled}
            className={errors.location ? "is-invalid" : ""}
          >
            <option value="">Select location</option>
            {locationOptions.map(location => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          {errors.location && <div className="invalid-feedback">{errors.location}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="age">
            <i className="fas fa-calendar-alt"></i> Property Age (years)
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={errors.age ? "is-invalid" : ""}
            disabled={disabled}
            min="0"
            max="100"
            placeholder="Enter property age"
          />
          {errors.age && <div className="invalid-feedback">{errors.age}</div>}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="predict-button"
            disabled={disabled}
          >
            {disabled ? (
              <span>
                <i className="fas fa-spinner fa-spin"></i> Processing...
              </span>
            ) : (
              <span>
                <i className="fas fa-calculator"></i> Predict Price
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataInputForm;
