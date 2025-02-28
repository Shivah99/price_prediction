import React from 'react';

const Form = () => {
    return (
        <div>
            <h1>Real Estate Price Prediction App</h1>
            <form id="pricePredictionForm">
                <label htmlFor="area">Area (sq ft):</label>
                <input type="number" id="area" name="area" required /><br /><br />

                <label htmlFor="bedrooms">Number of Bedrooms:</label>
                <input type="number" id="bedrooms" name="bedrooms" required /><br /><br />

                <label htmlFor="bathrooms">Number of Bathrooms:</label>
                <input type="number" id="bathrooms" name="bathrooms" required /><br /><br />

                <label htmlFor="location">Location:</label>
                <input type="text" id="location" name="location" required /><br /><br />

                <label htmlFor="age">Age of the Property:</label>
                <input type="number" id="age" name="age" required /><br /><br />

                <button type="submit">Submit</button>
            </form>
            <img src="images/image-1.jpg" alt="Real Estate" className="background-image" />
        </div>
    );
};

export default Form;
