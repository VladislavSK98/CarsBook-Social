import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import styles from './TrackDetails.module.css';
import { UserContext } from '../../contexts/UserContext';

const TrackDetails = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);

  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  const [userCars, setUserCars] = useState([]);
  const [newLap, setNewLap] = useState({ car: "", time: "", condition: "dry" });
  const [newCar, setNewCar] = useState({ make: "", model: "", year: "" });
  const [addingLap, setAddingLap] = useState(false);
  const [addingCar, setAddingCar] = useState(false);

  // Зареждане на пистата
  useEffect(() => {
    async function fetchTrack() {
      try {
        const res = await apiClient.get(`/tracks/${id}`);
        setTrack(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrack();
  }, [id]);

  // Зареждане на автомобилите на потребителя
  useEffect(() => {
    async function fetchUserCars() {
      try {
        const res = await apiClient.get(`/users/${user._id}/cars`);
        setUserCars(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    if (user?._id) fetchUserCars();
  }, [user]);

  const handleAddCar = async (e) => {
    e.preventDefault();
    setAddingCar(true);
    try {
      const res = await apiClient.post(`/cars`, newCar);
      const createdCar = res.data;
      setUserCars((prev) => [...prev, createdCar]);
      setNewCar({ make: "", model: "", year: "" });
    } catch (err) {
      console.error("Failed to add car:", err);
    } finally {
      setAddingCar(false);
    }
  };

  const handleAddLap = async (e) => {
    e.preventDefault();
    if (!newLap.car || !newLap.time) return;
    setAddingLap(true);

    try {
      const res = await apiClient.post(`/tracks/${id}/laps`, {
        user: user._id,
        car: newLap.car,
        time: newLap.time,
        condition: newLap.condition,
      });
      const addedLap = res.data;
      setTrack((prev) => ({
        ...prev,
        fastestLaps: [...prev.fastestLaps, addedLap].sort((a, b) => a.time - b.time),
      }));
      setNewLap({ car: "", time: "", condition: "dry" });
    } catch (err) {
      console.error("Failed to add lap:", err);
    } finally {
      setAddingLap(false);
    }
  };

  if (loading) return <p className={styles.loading}>Loading track...</p>;
  if (!track) return <p className={styles.error}>Track not found</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{track.name}</h1>
      <p className={styles.location}><strong>Location:</strong> {track.location}</p>
      <p className={styles.length}><strong>Length:</strong> {track.length} m</p>
      {track.description && <p className={styles.description}>{track.description}</p>}
      {track.imageUrl && <img src={track.imageUrl} alt={track.name} className={styles.trackImage} />}

      <section className={styles.section}>
        <h2>🏎 Your Cars</h2>
        <form onSubmit={handleAddCar} className={styles.form}>
          <input
            placeholder="Make"
            value={newCar.make}
            onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
          />
          <input
            placeholder="Model"
            value={newCar.model}
            onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
          />
          <input
            placeholder="Year"
            value={newCar.year}
            onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
          />
          <button className="btn" disabled={addingCar}>{addingCar ? "Adding..." : "Add Car"}</button>
        </form>
        {userCars.length === 0 && <p>No cars yet. Add one above.</p>}
      </section>

      <section className={styles.section}>
        <h2>⏱ Add Your Lap</h2>
        <form onSubmit={handleAddLap} className={styles.form}>
          <select
            value={newLap.car}
            onChange={(e) => setNewLap({ ...newLap, car: e.target.value })}
          >
            <option value="">Select your car</option>
            {userCars.map((c) => (
              <option key={c._id} value={c._id}>{c.make} {c.model}</option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Time (s)"
            value={newLap.time}
            onChange={(e) => setNewLap({ ...newLap, time: e.target.value })}
          />
          <select
            value={newLap.condition}
            onChange={(e) => setNewLap({ ...newLap, condition: e.target.value })}
          >
            <option value="dry">Dry</option>
            <option value="wet">Wet</option>
          </select>
          <button className="btn" disabled={addingLap}>{addingLap ? "Adding..." : "Add Lap"}</button>
        </form>
      </section>

      <section className={styles.section}>
        <h2>🏁 Fastest Laps</h2>
        {track.fastestLaps.length === 0 && <p>No laps yet.</p>}
        <ul className={styles.lapsList}>
          {track.fastestLaps.map((lap) => (
            <li key={lap._id} className={styles.lapItem}>
              {lap.user?.username || "Unknown"} - {lap.car?.make} {lap.car?.model} - {lap.time}s ({lap.condition})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default TrackDetails;