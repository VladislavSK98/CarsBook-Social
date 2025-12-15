// src/pages/Parking/TracksSection.jsx
import React, { useEffect, useState } from 'react';
import { getAllTracks } from '../../api/tracksApi';
import { Link } from 'react-router-dom';
import styles from './Parking.module.css';

export default function TracksSection() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    getAllTracks()
      .then(setTracks)
      .catch(console.error);
  }, []);

  return (
    <section className={styles['tracks-section']}>
      <h2>🏁 Tracks & Fastest Laps</h2>

      <div className="track-list">
        {tracks
          .slice()
          .reverse()
          .map((track) => (
            <div key={track._id} className={styles['track-card']}>
              <img
                src={track.imageUrl || 'https://via.placeholder.com/400x200?text=No+Track+Image'}
                alt={track.name}
              />

              <h3>{track.name}</h3>
              <p>{track.location}</p>

              {track.fastestLaps?.length > 0 ? (
                <table className={styles['lap-times-table']}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>User</th>
                      <th>Car</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {track.fastestLaps
                      .slice(0, 3) // TOP 3
                      .map((lap, index) => (
                        <tr key={lap._id}>
                          <td>{index + 1}</td>
                          <td>{lap.user?.username || 'User'}</td>
                          <td>{lap.car?.make || 'User Car'} {lap.car?.model}</td>
                          <td>{lap.time}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p className={styles['no-times']}>No lap times yet.</p>
              )}

              <Link to={`/tracks/${track._id}`}>
                <button>🔍 View Track</button>
              </Link>
            </div>
          ))}
      </div>
    </section>
  );
}
