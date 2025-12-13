// src/pages/Parking/CarsSection.jsx
import React, { useEffect, useState } from 'react';
import { getAllCars } from '../../api/carsApi';
import { Link } from 'react-router-dom';
import styles from './Parking.module.css';

export default function CarsSection() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    getAllCars().then(setCars).catch(console.error);
  }, []);

  return (
    <section className={styles['cars-section']}>
      <h2>🚗 Users Cars</h2>
      <div className="car-list">
        {cars.map((car) => (
          <div key={car._id} className={styles['car-card']}>
            <img
              src={car.imageUrl || 'https://via.placeholder.com/300x180?text=No+Image'}
              alt={`${car.make} ${car.model}`}
            />
            <div className={styles['car-badge']}>{car.year}</div>
            <h3>{car.make} {car.model}</h3>
            <p><strong>Owner:</strong> {car.userId?.username || 'Unknown'}</p>
            <p><strong>Power:</strong> {car.power} к.с.</p>
            <Link to={`/cars/${car._id}`}><button>🔍 Details</button></Link>
          </div>
        ))}
      </div>
    </section>
  );
}
