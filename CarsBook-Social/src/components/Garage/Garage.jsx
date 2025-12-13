import { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/UserContext";
import { getMyGarageData } from "../../api/garageApi";
import { addCar, deleteCar } from "../../api/carsApi";
import { useNavigate } from "react-router-dom";
import { addCarToGarage } from "../../api/garageApi";
import { createPost } from "../../api/postApi";
import { getUserPosts } from "../../api/garageApi";
import { addTrack } from "../../api/tracksApi";
import styles from "./Garage.module.css";
import PostSection from "../Parking/PostSection";

export default function MyGarage() {
  const { user, accessToken } = useUserContext();
  const [garageData, setGarageData] = useState(null);
  const [showCarForm, setShowCarForm] = useState(false);
  const [showTrackForm, setShowTrackForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);
  const [editCarData, setEditCarData] = useState(null);

  const [newCar, setNewCar] = useState({
    make: "",
    model: "",
    year: "",
    power: "",
    imageUrl: "",
    mods: "",
  });

  const [newTrack, setNewTrack] = useState({
    name: "",
    location: "",
    imageUrl: "",
  });

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      getMyGarageData(user._id).then(setGarageData);
      getUserPosts(user._id).then((userPosts) => {
        setGarageData((prev) => ({ ...prev, posts: userPosts }));
      });
    }
  }, [user]);

  if (!garageData) return <p>Loading...</p>;

  const handleCarChange = (e) =>
    setNewCar({ ...newCar, [e.target.name]: e.target.value });
  const handleEditChange = (e) =>
    setEditCarData({ ...editCarData, [e.target.name]: e.target.value });

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      const createdCar = await addCarToGarage(user._id, newCar); // 🛠️ тази промяна
      setGarageData((prev) => ({ ...prev, cars: [...prev.cars, createdCar] }));
      setShowCarForm(false);
      setNewCar({
        make: "",
        model: "",
        year: "",
        power: "",
        imageUrl: "",
        mods: "",
      });
    } catch (err) {
      alert("Error adding car: " + err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCar(editingCarId, editCarData);
      setGarageData((prev) => ({
        ...prev,
        cars: prev.cars.map((c) => (c._id === editingCarId ? editCarData : c)),
      }));
      setEditingCarId(null);
    } catch (err) {
      alert("Error editing car: " + err.message);
    }
  };

  const handleDeleteCar = async (carId) => {
    try {
      await deleteCar(carId);
      setGarageData((prev) => ({
        ...prev,
        cars: prev.cars.filter((car) => car._id !== carId),
      }));
    } catch (err) {
      alert("Error deleting car: " + err.message);
    }
  };

  const handleEditClick = (car) => {
    setEditingCarId(car._id);
    setEditCarData({ ...car });
  };

  const handlePostChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handlePublishPost = async () => {
    try {
      const createdPost = await createPost({
        title: newPost.title,
        text: newPost.content,
        themeId: "garage", // или друга стойност според нуждите
        authorId: user._id,
      });
      setGarageData((prev) => ({
        ...prev,
        posts: [...(prev.posts || []), createdPost],
      }));
      setNewPost({ title: "", content: "" });
      setShowPostForm(false);
    } catch (err) {
      alert("Error publishing post: " + err.message);
    }
  };

  const handleTrackChange = (e) => {
    setNewTrack({ ...newTrack, [e.target.name]: e.target.value });
  };

  const handleAddTrack = async () => {
    try {
      const createdTrack = await addTrack(newTrack);
      alert(`Track "${createdTrack.name}" added!`);
      setShowTrackForm(false);
      setNewTrack({ name: "", location: "", imageUrl: "" });
    } catch (err) {
      alert("Error adding track: " + err.message);
    }
  };

  return (
    <section className={styles.garage}>
      {/* 🔹 Профил секция */}
      <div className="profile-header">
        <img src={user.avatar || "https://i.pravatar.cc/100"} alt="Profile" />
        <div>
          <h1>{user.username}'s Garage</h1>
          <p>Member since {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* 🚗 My Cars */}
      <section className="section my-cars">
        <div className="section-header">
          <h2>🚗 My Cars</h2>
          <button onClick={() => setShowCarForm(!showCarForm)}>
            {showCarForm ? "Cancel" : "+ Add Car"}
          </button>
        </div>

        {showCarForm && (
          <form onSubmit={handleAddCar} className="car-form">
            <input
              name="make"
              value={newCar.make}
              onChange={handleCarChange}
              placeholder="Make"
              required
            />
            <input
              name="model"
              value={newCar.model}
              onChange={handleCarChange}
              placeholder="Model"
              required
            />
            <input
              name="year"
              value={newCar.year}
              onChange={handleCarChange}
              placeholder="Year"
              required
            />
            <input
              name="power"
              value={newCar.power}
              onChange={handleCarChange}
              placeholder="Horsepower"
              required
            />
            <input
              name="imageUrl"
              value={newCar.imageUrl}
              onChange={handleCarChange}
              placeholder="Image URL"
            />
            <textarea
              name="mods"
              value={newCar.mods}
              onChange={handleCarChange}
              placeholder="Modifications"
            />
            <button type="submit">Add Car</button>
          </form>
        )}

        <div className="car-list">
          {garageData.cars.length === 0 ? (
            <p>No cars yet.</p>
          ) : (
            garageData.cars.map((car) => (
              <div className="car-card" key={car._id}>
                {editingCarId === car._id ? (
                  <form onSubmit={handleEditSubmit} className="edit-car-form">
                    <input
                      name="make"
                      value={editCarData.make}
                      onChange={handleEditChange}
                    />
                    <input
                      name="model"
                      value={editCarData.model}
                      onChange={handleEditChange}
                    />
                    <input
                      name="year"
                      value={editCarData.year}
                      onChange={handleEditChange}
                    />
                    <input
                      name="power"
                      value={editCarData.power}
                      onChange={handleEditChange}
                    />
                    <input
                      name="imageUrl"
                      value={editCarData.imageUrl}
                      onChange={handleEditChange}
                    />
                    <textarea
                      name="mods"
                      value={editCarData.mods}
                      onChange={handleEditChange}
                    />
                    <button type="submit">💾 Save</button>
                    <button type="button" onClick={() => setEditingCarId(null)}>
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <img
                      src={
                        car.imageUrl ||
                        "https://via.placeholder.com/200x120?text=No+Image"
                      }
                      alt={`${car.make} ${car.model}`}
                    />
                    <p>
                      <strong>
                        {car.make} {car.model}
                      </strong>{" "}
                      ({car.year}) ({car.power})
                    </p>
                    <p>{car.mods}</p>
                    <div className="car-actions">
                      <button onClick={() => navigate(`/cars/${car._id}`)}>
                        🔍 Details
                      </button>
                      {car.ownerId === user._id && (
                        <>
                          <button onClick={() => handleEditClick(car)}>
                            ✏️ Edit
                          </button>
                          <button onClick={() => handleDeleteCar(car._id)}>
                            ❌ Delete
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </section>
      {/* 🏁 My Tracks */}
      <section className="section my-tracks">
        <div className="section-header">
          <h2>🏁 My Tracks</h2>
          <button onClick={() => setShowTrackForm(!showTrackForm)}>
            {showTrackForm ? "Cancel" : "+ Add Track"}
          </button>
        </div>

        {showTrackForm && (
          <form className="track-form">
            <input
              name="name"
              value={newTrack.name}
              onChange={handleTrackChange}
              placeholder="Track Name"
            />
            <input
              name="location"
              value={newTrack.location}
              onChange={handleTrackChange}
              placeholder="Location"
            />
            <input
              name="length"
              value={newTrack.length}
              onChange={handleTrackChange}
              placeholder="Length (m)"
            />
            <input
              name="imageUrl"
              value={newTrack.imageUrl}
              onChange={handleTrackChange}
              placeholder="Image URL"
            />
            <button type="button" onClick={handleAddTrack}>
              Add Track
            </button>
          </form>
        )}

        <div className="track-list">
          {garageData.tracks?.length > 0 ? (
            garageData.tracks.map((track) => (
              <div className="track-card" key={track._id}>
                <img
                  src={
                    track.imageUrl ||
                    "https://via.placeholder.com/200x120?text=No+Image"
                  }
                  alt={track.name}
                />
                <h3>{track.name}</h3>
                <p>{track.location}</p>
                <p>{track.length} m</p>
              </div>
            ))
          ) : (
            <p>No tracks yet.</p>
          )}
        </div>
      </section>

      {/* 📝 My Posts */}
      <section className="section my-posts">
        <div className="section-header">
          <h2>📝 My Posts</h2>
          <button onClick={() => setShowPostForm(!showPostForm)}>
            {showPostForm ? "Cancel" : "+ New Post"}
          </button>
        </div>

        {showPostForm && (
          <form className="post-form">
            <input
              name="title"
              value={newPost.title}
              onChange={handlePostChange}
              placeholder="Post Title"
            />
            <textarea
              name="content"
              value={newPost.content}
              onChange={handlePostChange}
              placeholder="Content..."
            />
            <button type="button" onClick={handlePublishPost}>
              Publish
            </button>
          </form>
        )}

        <div className="user-posts">
          {garageData.posts?.length > 0 ? (
            garageData.posts.map((post) => (
              <div className="post-card" key={post._id}>
                <h3>{post.title}</h3>
                <p>{post.text}</p>
                <p className="post-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p>No posts yet.</p>
          )}
        </div>
      </section>

      {/* ⏱️ My Lap Times */}
      <section className="section my-times">
        <div className="section-header">
          <h2>⏱️ My Lap Times</h2>
        </div>

        <table>
          <thead>
            <tr>
              <th>Track</th>
              <th>Car</th>
              <th>Time</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {garageData.times.length === 0 ? (
              <tr>
                <td colSpan="4">No lap times yet.</td>
              </tr>
            ) : (
              garageData.times.map((time) => (
                <tr key={time._id}>
                  <td>{time.trackName}</td>
                  <td>{time.carName}</td>
                  <td>{time.time}</td>
                  <td>{new Date(time.date).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </section>
  );
}
