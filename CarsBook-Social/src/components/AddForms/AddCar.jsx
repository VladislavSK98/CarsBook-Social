import { useState } from 'react';
import { useUserContext } from '../../contexts/UserContext'

export default function AddCarForm() {
  const { user } = useUserContext();
  
  const [car, setCar] = useState({
    make: "",
    model: "",
    year: "",
    horsepower: "",
    image: "",
  });

  const handleChange = e => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,

        },
        body: JSON.stringify(car),
      });

      if (!res.ok) throw new Error('Failed to add car');

      const data = await res.json();
      alert('Car added Successful!');
      setCar({ make: "", model: "", year: "", horsepower: "", image: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Brand"
        value={car.brand}
        onChange={(e) => setCar({ ...car, brand: e.target.value })}
        className={styles.input}
        required
      />
      <input
        type="text"
        placeholder="Model"
        value={car.model}
        onChange={(e) => setCar({ ...car, model: e.target.value })}
        className={styles.input}
        required
      />
      <input
        type="number"
        placeholder="Year"
        value={car.year}
        onChange={(e) => setCar({ ...car, year: e.target.value })}
        className={styles.input}
        required
      />
      <input
        type="number"
        placeholder="Horsepower (HP)"
        value={car.horsepower}
        onChange={(e) => setCar({ ...car, horsepower: e.target.value })}
        className={styles.input}
        required
      />
      <input
        type="text"
        placeholder="Image URL"
        value={car.image}
        onChange={(e) => setCar({ ...car, image: e.target.value })}
        className={styles.input}
        required
      />

      <button type="submit" className="bg-blue-500 text-white py-2 rounded">Добави кола</button>
    </form>
  );
}
