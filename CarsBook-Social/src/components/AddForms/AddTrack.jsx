import { useState } from 'react';

export default function AddTrackForm() {
  const [form, setForm] = useState({
    name: '',
    location: '',
    length: '',
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/tracks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Error in adding track');

      alert('Track added Successful!');
      setForm({ name: '', location: '', length: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
      <input type="text" name="name" placeholder="Track name" value={form.name} onChange={handleChange} required />
      <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
      <input type="number" name="length" placeholder="Length (m)" value={form.length} onChange={handleChange} required />
      <button type="submit" className="bg-green-500 text-white py-2 rounded">Add Track</button>
    </form>
  );
}
