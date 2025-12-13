import { useEffect, useState } from "react";
import TopTracks from "../Tracks/TopTracks";
// import { getTopCars, getLatestPosts } from "../../services/api";
import { Link } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import { getTopCars} from "../../api/carsApi";
import { getLatestPosts } from "../../api/postApi"; // Предполага се, че имаш функция за получаване на последните постове

export default function Home() {
  const [cars, setCars] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getTopCars().then(cars => {
        const topThree = cars.slice(0, 3); // ← Ограничение тук
        setCars(topThree);
    getLatestPosts().then(posts => {
        const latestPosts = posts.slice(0, 3); // Ограничаваме до 3 поста
        setPosts(latestPosts);
      }
    );
    });
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
        <section className="section-highlight">
          <h1>🔥 Top Cars</h1>
          <div className="home-grid">
  {cars.length > 0 ? cars.map(car => (
    <div key={car._id} className="card">
      <img src={car.imageUrl} alt={car.name} />
      <h3>{car.make} {car.model}</h3>
      <Link to={`/cars/${car._id}`} className="btn details-btn">Details</Link>
    </div>
  )) : <p className="no-articles">No top cars yet.</p>}
</div>
        </section>

        <section className="section-highlight">
          <h1>🗨️ Latest Posts</h1>
          <div className="home-grid">
          {posts.length > 0 ? posts.map(post => (
  <div key={post._id} className="card">
    <h3>{post.title}</h3>
    <p><strong>By:</strong> {post.author}</p>
    <p><strong>Date:</strong> {new Date(post.createdAt).toLocaleDateString()}</p>
    <p>{post.content}...</p>
    <Link to={`/posts/${post._id}`} className="btn details-btn">Read More</Link>
  </div>
)) : <p className="no-articles">No posts available.</p>}
          </div>
        </section>

        <section className="section-highlight">
          <h1>🏁 Latest Tracks</h1>
          <TopTracks />
        </section>

        <section className="quote-section">
          <h2>Legendary Racing Quotes</h2>
          <div className="quote-container">
            <blockquote>
              "To finish first, first you have to finish." – Ayrton Senna
            </blockquote>
            <blockquote>
              "Racing is life. Anything before or after is just waiting." –
              Steve McQueen
            </blockquote>
            <blockquote>
              "You can’t overtake 15 cars in sunny weather, but you can when
              it’s raining." – Senna
            </blockquote>
          </div>
        </section>
      </div>
    </section>
  );
}
