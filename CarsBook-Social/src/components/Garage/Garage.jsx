// src/components/Garage/Garage.jsx
import { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/UserContext";
import {
  getMyGarageData,
  addCarToGarage,
  getUserPosts,
} from "../../api/garageApi";
import { addCar, deleteCar, updateCar } from "../../api/carsApi";
import { createPost, updatePost, deletePost } from "../../api/postApi";
import { addTrack } from "../../api/tracksApi";
import { addTrackForUser } from "../../api/tracksApi";
import { useNavigate } from "react-router-dom";
import styles from "./Garage.module.css";

export default function MyGarage() {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const [garage, setGarage] = useState({ cars: [], tracks: [], times: [] });
  const [posts, setPosts] = useState([]);

  const [showCarForm, setShowCarForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showTrackForm, setShowTrackForm] = useState(false);

  const [isAddingCar, setIsAddingCar] = useState(false);
  const [reloadGarage, setReloadGarage] = useState(0);

  const [editingCarId, setEditingCarId] = useState(null);
  const [editCarData, setEditCarData] = useState({});

  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostData, setEditPostData] = useState({ title: "", text: "" });

  const [newCar, setNewCar] = useState({
    make: "",
    model: "",
    year: "",
    power: "",
    imageUrl: "",
    mods: "",
  });

  const [newPost, setNewPost] = useState({ title: "", text: "" });

  const [newTrack, setNewTrack] = useState({
    name: "",
    location: "",
    imageUrl: "",
  });

  // ===== LOAD DATA =====
  useEffect(() => {
    if (!user?._id) return;

    getMyGarageData(user._id).then(setGarage).catch(console.error);

    getUserPosts(user._id).then(setPosts).catch(console.error);
  }, [user, reloadGarage]);

  // ===== CARS =====
  const handleAddCar = async (e) => {
    e.preventDefault();
    setIsAddingCar(true);

    try {
      const createdCar = await addCar(newCar);
      await addCarToGarage(user._id, createdCar._id);

      setGarage((g) => ({
        ...g,
        cars: [...g.cars, createdCar],
      }));

      setNewCar({
        make: "",
        model: "",
        year: "",
        power: "",
        imageUrl: "",
        mods: "",
      });
    } catch (err) {
      console.error("Failed to add car", err);
    } finally {
      setIsAddingCar(false);
    }

    setReloadGarage((prev) => prev + 1);
    setShowCarForm(false);
  };

  const handleDeleteCar = async (id) => {
    try {
      await deleteCar(id);
      setGarage((g) => ({
        ...g,
        cars: g.cars.filter((c) => c._id !== id),
      }));
    } catch (err) {
      console.error("Failed to delete car", err);
    }
  };

  const handleEditCar = async (e) => {
    e.preventDefault();

    try {
      const updated = await updateCar(editingCarId, editCarData);
      setGarage((g) => ({
        ...g,
        cars: g.cars.map((c) => (c._id === editingCarId ? updated : c)),
      }));
      setEditingCarId(null);
      setEditCarData({});
    } catch (err) {
      console.error("Failed to edit car", err);
    }
  };

  // ===== POSTS =====
  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!newPost.title || !newPost.text) return;

    try {
      const post = await createPost({
        title: newPost.title,
        text: newPost.text,
        themeId: null, // default, ако няма тема
      });

      setPosts((prev) => [...prev, post]);
      setNewPost({ title: "", text: "" });
      setShowPostForm(false);
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await deletePost(id);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete post", err);
      alert("Cannot delete post. Maybe you are not the owner.");
    }
  };

  // ===== TRACKS =====
  const handleAddTrack = async (e) => {
    e.preventDefault();

    try {
      const createdTrack = await addTrack({ ...newTrack, owner: user._id });

      // ако имаш endpoint като при колите (препоръчително)
      await addTrackForUser(user._id, createdTrack._id);

      setGarage((g) => ({
        ...g,
        tracks: [...g.tracks, createdTrack],
      }));

      setNewTrack({
        name: "",
        location: "",
        imageUrl: "",
        description: "",
        length: "",
      });
      setShowTrackForm(false);
    } catch (err) {
      console.error("Failed to add track", err);
    }
    setShowTrackForm(false);
    setReloadGarage((prev) => prev + 1);
  };

  // ===== RENDER =====
  return (
    <section className={styles.garage}>
      {/* HEADER */}
      <header className={styles.header}>
        <img src={user.avatar || "https://i.pravatar.cc/120"} alt="avatar" />
        <div>
          <h1>{user.username}'s Garage</h1>
          <p>🛠 Private space for cars & performance</p>
        </div>
      </header>

      {/* STATS */}
      <div className={styles.stats}>
        <div>
          <span>🚗 Cars</span>
          <strong>{garage.cars.length}</strong>
        </div>
        <div>
          <span>⚡ Total HP</span>
          <strong>
            {garage.cars.reduce((sum, c) => sum + Number(c.power || 0), 0)}
          </strong>
        </div>
        <div>
          <span>🏁 Tracks</span>
          <strong>{garage.tracks.length}</strong>
        </div>
        <div>
          <span>📝 Posts</span>
          <strong>{posts.length}</strong>
        </div>
      </div>

      {/* TOOLBOX */}
      <div className={styles.toolbox}>
        <button onClick={() => setShowCarForm(true)}>🛠 Add Car</button>
        <button onClick={() => setShowTrackForm(true)}>🏁 Add Track</button>
        <button onClick={() => setShowPostForm(true)}>📝 New Post</button>
      </div>

      {/* CARS */}
      <section className={styles.section}>
        <h2>🚗 My Cars</h2>
        {showCarForm && (
          <form onSubmit={handleAddCar} className={styles.form}>
            {Object.keys(newCar).map((k) => (
              <input
                key={k}
                placeholder={k}
                value={newCar[k]}
                onChange={(e) => setNewCar({ ...newCar, [k]: e.target.value })}
              />
            ))}
            <button disabled={isAddingCar}>
              {isAddingCar ? "Adding..." : "Add"}
            </button>
          </form>
        )}

        <div className={styles.carsGrid}>
          {garage.cars.map((car) => (
            <div key={car._id} className={styles.carCard}>
              <img
                src={car.imageUrl || "https://via.placeholder.com/400x200"}
                alt=""
              />
              <h3>
                {car.make} {car.model}
              </h3>
              <p>
                {car.year} · {car.power} hp
              </p>

              <div className={styles.actions}>
                <button onClick={() => navigate(`/cars/${car._id}`)}>
                  Details
                </button>
                <button onClick={() => setEditingCarId(car._id)}>Edit</button>
                <button onClick={() => handleDeleteCar(car._id)}>Delete</button>
              </div>

              {editingCarId === car._id && (
                <form onSubmit={handleEditCar} className={styles.form}>
                  {Object.keys(car)
                    .filter((k) => k !== "_id")
                    .map((k) => (
                      <input
                        key={k}
                        defaultValue={car[k]}
                        onChange={(e) =>
                          setEditCarData({
                            ...editCarData,
                            [k]: e.target.value,
                          })
                        }
                      />
                    ))}
                  <button>Save</button>
                  <button type="button" onClick={() => setEditingCarId(null)}>
                    Cancel
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* POSTS */}
      <section className={styles.section}>
        <h2>📝 My Posts</h2>
        {showPostForm && (
          <form onSubmit={handleCreatePost} className={styles.form}>
            <input
              placeholder="Post title"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
            />
            <textarea
              placeholder="Post text"
              value={newPost.text}
              onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
            />
            <button>Create</button>
            <button type="button" onClick={() => setShowPostForm(false)}>
              Cancel
            </button>
          </form>
        )}

        {posts.map((p) => (
          <div key={p._id} className={styles.postCard}>
            {editingPostId === p._id ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const updated = await updatePost(p._id, editPostData);
                  setPosts(
                    posts.map((post) => (post._id === p._id ? updated : post))
                  );
                  setEditingPostId(null);
                }}
                className={styles.form}
              >
                <input
                  value={editPostData.title}
                  onChange={(e) =>
                    setEditPostData((d) => ({ ...d, title: e.target.value }))
                  }
                />
                <textarea
                  value={editPostData.text}
                  onChange={(e) =>
                    setEditPostData((d) => ({ ...d, text: e.target.value }))
                  }
                />
                <button>Save</button>
                <button type="button" onClick={() => setEditingPostId(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <div className={styles.actions}>
                  <button
                    onClick={() => {
                      setEditingPostId(p._id);
                      setEditPostData({ title: p.title, text: p.text });
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeletePost(p._id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </section>

      {/* TRACKS */}
      <section className={styles.section}>
        <h2>🏁 My Tracks</h2>
        {showTrackForm && (
          <form onSubmit={handleAddTrack} className={styles.form}>
            <input
              placeholder="Track name"
              value={newTrack.name}
              onChange={(e) =>
                setNewTrack({ ...newTrack, name: e.target.value })
              }
            />
            <input
              placeholder="Location"
              value={newTrack.location}
              onChange={(e) =>
                setNewTrack({ ...newTrack, location: e.target.value })
              }
            />
            <input
              placeholder="Image URL"
              value={newTrack.imageUrl}
              onChange={(e) =>
                setNewTrack({ ...newTrack, imageUrl: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Length (meters)"
              value={newTrack.length || ""}
              onChange={(e) =>
                setNewTrack({ ...newTrack, length: Number(e.target.value) })
              }
            />
            <textarea
              placeholder="Description"
              value={newTrack.description || ""}
              onChange={(e) =>
                setNewTrack({ ...newTrack, description: e.target.value })
              }
            />
            <button>Add Track</button>
          </form>
        )}
      </section>
    </section>
  );
}
