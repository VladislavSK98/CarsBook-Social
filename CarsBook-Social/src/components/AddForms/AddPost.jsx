import { useState } from 'react';

export default function AddPostForm() {
  const [form, setForm] = useState({
    title: '',
    body: '',
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Error in creating post');

      alert('Post created!');
      setForm({ title: '', body: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
      <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <textarea name="body" placeholder="Content" value={form.body} onChange={handleChange} required />
      <button type="submit" className="bg-purple-500 text-white py-2 rounded">Post</button>
    </form>
  );
}
