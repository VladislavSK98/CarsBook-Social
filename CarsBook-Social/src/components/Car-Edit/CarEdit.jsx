import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCarById, updateCar } from '../../api/carsApi';

export default function CarEdit() {
    const { carId } = useParams();
    const navigate = useNavigate();
    const [carData, setCarData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getCarById(carId)
            .then(data => {
                setCarData(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [carId]);

    const handleChange = (e) => {
        setCarData({ ...carData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateCar(carId, carData);
            navigate(`/garage`);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading car data...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <section className="car-edit-page">
  <div className="edit-card">
    <h2>Edit Car: {carData.make} {carData.model}</h2>
    <form onSubmit={handleSubmit}>
                <input
                    name="make"
                    value={carData.make}
                    onChange={handleChange}
                    placeholder="Make"
                    required
                />
                <input
                    name="model"
                    value={carData.model}
                    onChange={handleChange}
                    placeholder="Model"
                    required
                />
                <input
                    name="year"
                    value={carData.year}
                    onChange={handleChange}
                    placeholder="Year"
                    required
                />
                <input
                    name="power"
                    value={carData.power}
                    onChange={handleChange}
                    placeholder="Horsepower"
                />
                <input
                    name="imageUrl"
                    value={carData.imageUrl}
                    onChange={handleChange}
                    placeholder="Image URL"
                />
                <textarea
                    name="mods"
                    value={carData.mods}
                    onChange={handleChange}
                    placeholder="Modifications"
                />
                <button type="submit">Save Changes</button>
            </form>
            </div>
        </section>
    );
}
