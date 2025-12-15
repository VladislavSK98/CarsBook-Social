import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCarById, deleteCar } from "../../api/carsApi";
import { useUserContext } from "../../contexts/UserContext";
import styles from "./CarDetails.module.css";

export default function CarDetails() {
    const { carId } = useParams();
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [car, setCar] = useState(null);

    useEffect(() => {
        getCarById(carId).then(setCar);
    }, [carId]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this car?")) {
            await deleteCar(carId);
            navigate("/garage");
        }
    };

    if (!car) {
        return <p className={styles.loading}>Loading...</p>;
    }

    const isOwner =
        user?._id &&
        (car.ownerId === user._id ||
            car.ownerId?._id === user._id ||
            car.userId === user._id ||
            car.userId?._id === user._id);

    return (
        <section className={styles.detailsPage}>
            <div className={styles.navButtons}>
                <button onClick={() => navigate("/garage")}>
                    ← Back to Garage
                </button>
                <button onClick={() => navigate("/parking")}>
                    ← Back to Parking
                </button>
            </div>

            <div className={styles.card}>
                <img
                    src={
                        car.imageUrl ||
                        "https://via.placeholder.com/800x400?text=No+Image"
                    }
                    alt={`${car.make} ${car.model}`}
                    className={styles.image}
                />

                <div className={styles.content}>
                    <h2>
                        🚗 {car.make} {car.model}
                    </h2>

                    <div className={styles.infoGrid}>
                        <p>
                            <strong>Year:</strong> {car.year || "N/A"}
                        </p>
                        <p>
                            <strong>Power:</strong> {car.power} hp
                        </p>
                        <p>
                            <strong>Modifications:</strong>{" "}
                            {car.mods || "None"}
                        </p>
                    </div>

                    {isOwner && (
                        <div className={styles.actions}>
                            <button
                                className={styles.edit}
                                onClick={() =>
                                    navigate(`/cars/edit/${car._id}`)
                                }
                            >
                                ✏️ Edit
                            </button>
                            <button
                                className={styles.delete}
                                onClick={handleDelete}
                            >
                                ❌ Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
