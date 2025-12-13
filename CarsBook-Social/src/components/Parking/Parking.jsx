import React from 'react';
import PostSection from './PostSection';
import CarsSection from './CarsSection';
import TracksSection from './TracksSection';
import styles from './Parking.module.css';

export default function Parking() {
  return (
    <section className={styles['parking-page']}>
      <header className={styles['parking-header']}>
        <h1>🏁 Parking – Social zone for Cars, Tracks, Posts and Passion</h1>
        <p>Check all cars, tracks, posts and lap-times from car community!</p>
      </header>

      <div className={styles['parking-grid']}>
        <div className={styles['parking-section']}>
          <PostSection />
        </div>

        <div className={styles['parking-section']}>
          <CarsSection />
        </div>

        <div className={styles['parking-section']}>
          <TracksSection />
        </div>
      </div>
    </section>
  );
}
