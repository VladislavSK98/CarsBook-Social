import { useEffect, useState } from "react";
import TopTracks from "../Tracks/TopTracks";
import { Link } from "react-router-dom";
import { getTopCars } from "../../api/carsApi";
import { getLatestPosts } from "../../api/postApi";

export default function Home() {
  const [cars, setCars] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // 🔥 Top Cars
    getTopCars()
  .then((cars) => {
    const latestCars = cars
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);

    setCars(latestCars);
  })
  .catch(console.error);


    // 🗨️ Latest Posts
    getLatestPosts()
  .then((posts) => {
    const latest = posts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);

    setPosts(latest);
  })
  .catch(console.error);

  }, []);

  return (
    <section id="welcome-world">
      <div className="hero-banner">
        <div className="welcome-message">
          <h2>Adrenaline. Speed. Community.</h2>
          <h3>Join us in the CarBook social network and share your experience</h3>
          <Link to="/parking" className="btn explore-btn">
            Explore Parking
          </Link>
        </div>
        <img src="src/assets/touge.jpg" className="foncard" />
      </div>

      <div id="home-page">
        {/* 🔥 TOP CARS */}
        <section className="section-highlight">
          <h1>🔥 Latest Added Cars</h1>
          <div className="home-grid">
            {cars.length > 0 ? (
              cars.map((car) => (
                <div key={car._id} className="card">
                  <img src={car.imageUrl} alt={`${car.make} ${car.model}`} />
                  <h3>{car.make} {car.model}</h3>
                  <Link to={`/cars/${car._id}`} className="btn details-btn">
                    Details
                  </Link>
                </div>
              ))
            ) : (
              <p className="no-articles">No top cars yet.</p>
            )}
          </div>
        </section>

        {/* 🗨️ LATEST POSTS */}
        <section className="section-highlight">
          <h1>🗨️ Latest Posts</h1>
          <div className="home-grid">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="card">
                  <h3>{post.title}</h3>

                  <p>
                    <strong>By:</strong>{" "}
                    {post.userId?.username || "Anon"}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>

                  <p>
                    {post.text.length > 100
                      ? post.text.slice(0, 100) + "..."
                      : post.text}
                  </p>

                  <Link
                    to={`/posts/${post._id}`}
                    className="btn details-btn"
                  >
                    Read More
                  </Link>
                </div>
              ))
            ) : (
              <p className="no-articles">No posts available.</p>
            )}
          </div>
        </section>

        {/* 🏁 TRACKS */}
        <section className="section-highlight">
          <h1>🏁 Tracks with most added laps</h1>
          <TopTracks />
        </section>

        {/* 💬 QUOTES */}
        <section className="quote-section">
          <h2>Legendary Racing Quotes</h2>
          <div className="quote-container">
            <blockquote>
              "To finish first, first you have to finish." – Ayrton Senna
            </blockquote>
            <blockquote>
              "Racing is life. Anything before or after is just waiting." – Steve McQueen
            </blockquote>
            <blockquote>
              "You can’t overtake 15 cars in sunny weather, but you can when it’s raining." – Senna
            </blockquote>
          </div>
        </section>
      </div>
    </section>
  );
}
