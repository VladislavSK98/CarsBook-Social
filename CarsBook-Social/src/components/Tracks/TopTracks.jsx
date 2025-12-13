// src/Tracks/TopTracks.jsx
import React, { useEffect, useState } from 'react';
import { getAllTracks } from '../../api/tracksApi';
import { Link } from 'react-router-dom';


const TopTracks = () => {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        async function fetchTracks() {
            try {
                const data = await getAllTracks();
                const topThree = data.slice(0, 3); // Само първите 3 писти
                setTracks(topThree);
            } catch (error) {
                console.error('Error loading tracks:', error);
            }
        }

        fetchTracks();
    }, []);

    return (
        <div className="top-tracks">
            <div className="tracks-grid">
                {tracks.map(track => (
                    <div key={track._id} className="track-card">
                        <img src={track.imageUrl} alt={track.name} className="track-image" />
                        <h3>{track.name}</h3>
                        <p><strong>Location:</strong> {track.location}</p>
                        <p><strong>Length:</strong> {track.length} km</p>
                        <Link to={`/tracks/${track._id}`} className="btn details-btn">Details</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopTracks;
