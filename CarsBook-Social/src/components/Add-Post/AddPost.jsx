import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../../api/postApi';


export default function AddPost() {
    const navigate = useNavigate();
    const [post, setPost] = useState({
        title: '',
        content: '',
        imageUrl: ''
    });

    const handleChange = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createPost(post);
        navigate('/forum'); // ако имаш форум или постове
    };

    return (
        <section className="post-form">
            <h2>New Post</h2>
            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="Post Title" value={post.title} onChange={handleChange} />
                <textarea name="content" placeholder="Write something..." value={post.content} onChange={handleChange} />
                <input name="imageUrl" placeholder="Image URL (optional)" value={post.imageUrl} onChange={handleChange} />
                <button type="submit">Publish</button>
            </form>
        </section>
    );
}
