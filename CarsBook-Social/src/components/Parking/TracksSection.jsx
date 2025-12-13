// src/pages/Parking/TracksSection.jsx
import React, { useEffect, useState } from 'react';
import styles from './Parking.module.css';


export default function TracksSection() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    setTracks([
      {
        id: 1,
        name: 'Serres Circuit',
        imageUrl: 'https://www.racingcircuits.info/uploads/images/Serres-Map.png',
        lapTimes: [
          { user: 'Иван', car: 'Mazda MX-5', time: '1:23.45' },
          { user: 'Петър', car: 'BMW E36', time: '1:20.87' },
        ],
      },
      { id: 2, name: 'Калояново', imageUrl: '', lapTimes: [] },
    ]);
  }, []);

  return (
   <section className={styles['tracks-section']}>
      <h2>🏁 Tracks & Lap Times</h2>
      <div className="track-list">
        {tracks.map((track) => (
          <div key={track.id} className={styles['track-card']}>
            <img
              src={track.imageUrl || 'https://via.placeholder.com/400x200?text=No+Track+Image'}
              alt={track.name}
            />
            <h3>{track.name}</h3>

            {track.lapTimes.length > 0 ? (
              <table className="lap-times-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Car</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {track.lapTimes.map((lap, i) => (
                    <tr key={i}>
                      <td>{lap.user}</td>
                      <td>{lap.car}</td>
                      <td>{lap.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-times">No lap times yet.</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
