// src/pages/Tracks.jsx
import React, { useEffect, useState } from 'react';
import { getAllTracks } from '../../api/tracksApi'; 


const Tracks = () => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTracks() {
            try {
                const data = await getAllTracks();
                setTracks(data);
            } catch (error) {
                console.error('Error fetching tracks:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchTracks();
    }, []);

    if (loading) return <p>Loading tracks...</p>;

    return (
      <div className="tracks-container">
        <h1>Race Tracks</h1>
        <div className="tracks-grid">
          {tracks.map((track) => (
            <div key={track._id} className="track-card">
              <h2>{track.name}</h2>
              {track.imageUrl && (
                <img
                  src={track.imageUrl}
                  alt={track.name}
                  className="track-image"
                />
              )}
              <p>
                <strong>Location:</strong> {track.location}
              </p>
              <p>
                <strong>Length:</strong> {track.length} m
              </p>
              
            </div>
          ))}
        </div>
      </div>
    );
};

export default Tracks;
