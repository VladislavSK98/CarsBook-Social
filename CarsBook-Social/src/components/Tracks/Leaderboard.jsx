import { useEffect, useState } from "react";

const Leaderboard = ({ trackId }) => {
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/laps/${trackId}`)
      .then((res) => res.json())
      .then((data) => setLaps(data));
  }, [trackId]);

  return (
    <div>
      <h3>Leaderboard</h3>
      <ul>
        {laps.map((lap, index) => (
          <li key={index}>{lap.user}: {lap.time}s</li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
