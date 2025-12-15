// src/pages/Parking/PostDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../../api/postApi";
import styles from "./PostDetails.module.css";

export default function PostDetails() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchPost = async () => {
    try {
      const data = await getPostById(postId); // ← тук вместо getPosts
      setPost(data);
    } catch (err) {
      console.error("Error fetching post details:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchPost();
}, [postId]);

  if (loading) return <p>Loading post...</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <section className={styles["post-details-section"]}>
        <div className={styles.navButtons}>
        <button onClick={() => navigate("/")}>Back to Home</button>
        <button onClick={() => navigate("/parking")}>Back to Parking</button>
        <button onClick={() => navigate("/my-garage")}>Back to Garage</button>
      </div>
      <h2>{post.title}</h2>
      <p>
        <strong>By:</strong> {post.userId?.username || "Anon"}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className={styles["post-content"]}>
        <p>{post.text}</p>
      </div>

      <h3>Comments ({post.comments?.length || 0})</h3>
      {post.comments?.length > 0 ? (
        <ul className={styles["comments-list"]}>
          {post.comments.map((comment) => (
            <li key={comment._id} className={styles["comment-item"]}>
              <strong>{comment.userId?.username || "User"}:</strong>{" "}
              {comment.text}
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}
    </section>
  );
}
