// src/components/Tracks/TrackDetails.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import styles from "./TrackDetails.module.css";
import { UserContext } from "../../contexts/UserContext";

const TrackDetails = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();


  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  const [userCars, setUserCars] = useState([]);
  const [newLap, setNewLap] = useState({
    car: "",
    time: "",
    condition: "dry",
  });
  const [addingLap, setAddingLap] = useState(false);

  // ===== LOAD TRACK =====
  useEffect(() => {
    async function fetchTrack() {
      try {
        const res = await apiClient.get(`/tracks/${id}`);
        setTrack(res.data);
      } catch (err) {
        console.error("Failed to load track:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrack();
  }, [id]);

  // ===== LOAD USER CARS FROM GARAGE =====
  useEffect(() => {
    if (!user?._id) return;

    async function fetchUserCars() {
      try {
        const res = await apiClient.get(`/garage/${user._id}`);
        setUserCars(res.data.cars || []);
      } catch (err) {
        console.error("Failed to load user cars:", err);
      }
    }

    fetchUserCars();
  }, [user]);

  // ===== ADD LAP =====
  const handleAddLap = async (e) => {
    e.preventDefault();
    if (!newLap.car || !newLap.time) return;

    setAddingLap(true);

    try {
      const res = await apiClient.post(`/tracks/${id}/lap`, {
        user: user._id,
        car: newLap.car,
        time: Number(newLap.time),
        condition: newLap.condition,
      });

      const addedLap = res.data;

      const updatedTrack = await apiClient.get(`/tracks/${id}`);
      setTrack(updatedTrack.data);

      setNewLap({ car: "", time: "", condition: "dry" });
    } catch (err) {
      console.error("Failed to add lap:", err);
    } finally {
      setAddingLap(false);
    }
  };

  const handleDeleteLap = async (lapId) => {
    if (!window.confirm("Delete this lap?")) return;

    try {
      await apiClient.delete(`/tracks/${id}/lap/${lapId}`);

      setTrack((prev) => ({
        ...prev,
        fastestLaps: prev.fastestLaps.filter((l) => l._id !== lapId),
      }));
    } catch (err) {
      console.error("Failed to delete lap:", err);
      alert("You can delete only your own laps.");
    }
  };

  // ===== RENDER =====
  if (loading) return <p className={styles.loading}>Loading track...</p>;
  if (!track) return <p className={styles.error}>Track not found</p>;

  return (
    <div className={styles.container}>

         <div className={styles.navButtons}>
      <button onClick={() => navigate("/")}>🏠 Back to Home</button>
      <button onClick={() => navigate("/parking")}>🅿️ Back to Parking</button>
      <button onClick={() => navigate("/my-garage")}>🚗 Back to Garage</button>
    </div>
      {/* TRACK INFO */}
      <h1 className={styles.title}>{track.name}</h1>
      <p className={styles.location}>
        <strong>Location:</strong> {track.location}
      </p>
      <p className={styles.length}>
        <strong>Length:</strong> {track.length} m
      </p>

      {track.description && (
        <p className={styles.description}>{track.description}</p>
      )}

      {track.imageUrl && (
        <img
          src={track.imageUrl}
          alt={track.name}
          className={styles.trackImage}
        />
      )}

      {/* ADD LAP */}
      {user && (
        <section className={styles.section}>
          <h2>⏱ Add Your Lap</h2>

          {userCars.length === 0 ? (
            <p>You need to add a car in your Garage first.</p>
          ) : (
            <form onSubmit={handleAddLap} className={styles.form}>
              <select
                value={newLap.car}
                onChange={(e) => setNewLap({ ...newLap, car: e.target.value })}
              >
                <option value="">Select your car</option>
                {userCars.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.make} {c.model} ({c.power} hp)
                  </option>
                ))}
              </select>

              <input
                type="number"
                step="0.01"
                placeholder="Time (seconds)"
                value={newLap.time}
                onChange={(e) => setNewLap({ ...newLap, time: e.target.value })}
              />

              <select
                value={newLap.condition}
                onChange={(e) =>
                  setNewLap({ ...newLap, condition: e.target.value })
                }
              >
                <option value="dry">Dry</option>
                <option value="wet">Wet</option>
              </select>

              <button disabled={addingLap}>
                {addingLap ? "Adding..." : "Add Lap"}
              </button>
            </form>
          )}
        </section>
      )}

      {/* FASTEST LAPS */}
      <section className={styles.section}>
        <h2>🏁 Fastest Laps</h2>

        {track.fastestLaps?.length === 0 && <p>No laps yet.</p>}

        <ul className={styles.lapsList}>
          {track.fastestLaps?.map((lap) => (
            <li key={lap._id} className={styles.lapItem}>
              <strong>{lap.user?.username || "Unknown"}</strong> –{" "}
              {lap.car?.make} {lap.car?.model} – {lap.time} min ({lap.condition}
              )
              {user && lap.user?._id === user._id && (
                <button
                  onClick={() => handleDeleteLap(lap._id)}
                  className={styles.deleteBtn}
                >
                  ❌
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default TrackDetails;
