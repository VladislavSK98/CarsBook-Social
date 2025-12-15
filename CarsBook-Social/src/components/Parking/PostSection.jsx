import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import styles from "./Parking.module.css";
import { createPost, getPosts, addComment, likePost, } from "../../api/postApi";

export default function PostSection() {
  const [posts, setPosts] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [commentTexts, setCommentTexts] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      alert("Error fetching posts: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postText.trim())
      return alert("Title and text required");

    try {
      await createPost({ title: postTitle, text: postText });
      setPostTitle("");
      setPostText("");
      fetchPosts();
    } catch (err) {
      alert("Error creating post: " + err.message);
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    const commentText = commentTexts[postId];
    if (!commentText) return;

    try {
      await addComment(postId, { text: commentText });
      setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
      fetchPosts();
    } catch (err) {
      alert("Error adding comment: " + err.message);
    }
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      fetchPosts();
    } catch (err) {
      alert("Error liking post: " + err.message);
    }
  };

  const getUsername = (user) => {
    if (!user) return "Anon";
    return typeof user === "object" ? user.username || "Anon" : "Anon";
  };

  return (
    <section className={styles["posts-section"]}>
      <h2>📝 Latest Posts</h2>

      <form className={styles["new-post-form"]} onSubmit={handleAddPost}>
        <input
          type="text"
          placeholder="Title..."
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
        />
        <textarea
          placeholder="Write something..."
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>

      {loading && <p>Loading posts...</p>}

      <div className={styles["post-list"]}>
        {posts
          .slice()
          .reverse()
          .map((post) => (
            <div key={post._id} className={styles["post-card"]}>
              <div className={styles["post-badge"]}>
                {getUsername(post.userId)}
              </div>

              <h3>{post.title}</h3>
              <p>{post.text}</p>
              <button onClick={() => handleLike(post._id)}>
                ❤️ {post.likes?.length || 0}
              </button>
                <Link to={`/posts/${post._id}`}>
    <button className={styles.detailsBtn}>Details</button>
  </Link>

              <form
                onSubmit={(e) => handleAddComment(e, post._id)}
                className={styles["comment-form"]}
              >
                <input
                  type="text"
                  placeholder="Comment..."
                  value={commentTexts[post._id] || ""}
                  onChange={(e) =>
                    setCommentTexts((prev) => ({
                      ...prev,
                      [post._id]: e.target.value,
                    }))
                  }
                />
                <button type="submit">💬</button>
              </form>

              <div className={styles["comments"]}>
                {post.comments?.map((c) => (
                  <p key={c._id || c.text}>
                    <em>{c.userId?.username || "User"}:</em> {c.text}
                  </p>
                ))}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
