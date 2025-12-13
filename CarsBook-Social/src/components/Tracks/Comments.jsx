import { useEffect, useState } from "react";

const Comments = ({ trackId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/comments/${trackId}`)
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, [trackId]);

  const addComment = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ trackId, content: newComment }),
    });

    if (response.ok) {
      setComments([...comments, { content: newComment }]);
      setNewComment("");
    }
  };

  return (
    <div>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>{comment.content}</li>
        ))}
      </ul>
      <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." />
      <button onClick={addComment}>Post</button>
    </div>
  );
};

export default Comments;
