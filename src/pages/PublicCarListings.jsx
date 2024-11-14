import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PublicCarListings.css';

const PublicCarListings = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get('/api/cars');
      setCars(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load cars');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="cars-container">
      <h1>Available Cars</h1>
      <div className="cars-grid">
        {cars.map((car) => (
          <div key={car._id} className="car-card">
            <div className="car-image">
              {car.images?.[0] && (
                <img src={car.images[0]} alt={`${car.year} ${car.make} ${car.model}`} />
              )}
            </div>
            <div className="car-details">
              <h2>{`${car.year} ${car.make} ${car.model}`}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicCarListings; 