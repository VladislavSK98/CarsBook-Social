import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrack } from '../../api/tracksApi';


export default function AddTrack() {
    const navigate = useNavigate();
    const [track, setTrack] = useState({
        name: '',
        location: '',
        length: '',
        imageUrl: ''
    });

    const handleChange = (e) => {
        setTrack({ ...track, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createTrack(track);
        navigate('/tracks'); // или където са ти пистите
    };

    return (
        <section className="track-form">
            <h2>Add New Track</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Track Name" value={track.name} onChange={handleChange} />
                <input name="location" placeholder="Location" value={track.location} onChange={handleChange} />
                <input name="length" placeholder="Length (km)" value={track.length} onChange={handleChange} />
                <input name="imageUrl" placeholder="Image URL" value={track.imageUrl} onChange={handleChange} />
                <button type="submit">Add Track</button>
            </form>
        </section>
    );
}
