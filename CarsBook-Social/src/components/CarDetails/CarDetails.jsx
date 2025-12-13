import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCarById, deleteCar } from '../../api/carsApi';
import { useUserContext } from '../../contexts/UserContext';


export default function CarDetails() {
    const { carId } = useParams();
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [car, setCar] = useState(null);

    useEffect(() => {
        getCarById(carId).then(setCar);
    }, [carId]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this car?')) {
            await deleteCar(carId);
            navigate('/garage');
        }
    };

    if (!car) return <p>Loading...</p>;

    const isOwner = (car.userId === user._id) || (car.userId?._id === user._id);
    console.log('Car Owner:', car.ownerId);
console.log('User ID:', user?._id);

    return (
        <section className="car-details-page">
            <div className="back-btn">
                <button onClick={() => navigate('/garage')}>← Back to Garage</button>
            </div>

            <div className="car-details-card fade-in">
                <img
                    src={car.imageUrl || 'https://via.placeholder.com/500x300?text=No+Image'}
                    alt={`${car.make} ${car.model}`}
                    className="car-details-img"
                />

                <div className="car-details-content">
                    <h2>
                        <span className="car-logo">🚗</span> {car.make} {car.model}
                    </h2>
                    <p><strong>Year:</strong> {car.year}</p>
                    <p><strong>Power:</strong> {car.power} hp</p>
                    <p><strong>Modifications:</strong> {car.mods || 'None'}</p>

                    

                    {isOwner && (
                        <div className="car-actions">
                            <button onClick={() => navigate(`/cars/edit/${car._id}`)}>✏️ Edit</button>
                            <button onClick={handleDelete}>❌ Delete</button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
