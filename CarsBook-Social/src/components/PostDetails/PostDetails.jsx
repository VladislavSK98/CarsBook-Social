// src/pages/Parking/PostDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, likePost } from "../../api/postApi";
import styles from "./PostDetails.module.css";

export default function PostDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(postId);
        setPost(data);
      } catch (err) {
        console.error("Error fetching post details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleLike = async () => {
    await likePost(postId);
    const updated = await getPostById(postId);
    setPost(updated);
  };

  if (loading) return <p>Loading post...</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <section className={styles.wrapper}>
      <div className={styles.card}>
        {/* NAV BUTTONS */}
        <div className={styles.navButtons}>
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/parking")}>Parking</button>
          <button onClick={() => navigate("/garage")}>Garage</button>
        </div>

        <h2>{post.title}</h2>

        <div className={styles.meta}>
          <span>👤 {post.userId?.username || "Anon"}</span>
          <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
        </div>

        <p className={styles.text}>{post.text}</p>

        <button className={styles.likeBtn} onClick={handleLike}>
          ❤️ {post.likes?.length || 0} Likes
        </button>

        <h3>💬 Comments ({post.comments?.length || 0})</h3>

        {post.comments.length > 0 ? (
          <ul className={styles.comments}>
            {post.comments.map((c) => (
              <li key={c._id}>
                <strong>{c.userId?.username || "User"}:</strong> {c.text}
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </section>
  );
}
