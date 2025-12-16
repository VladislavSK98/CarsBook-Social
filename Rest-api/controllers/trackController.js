const trackModel = require("../models/trackModel");
const Track = require('../models/trackModel');

async function getAllTracks(req, res) {
  try {
    const tracks = await Track.find()
      .populate("fastestLaps.user", "username")
      .populate("fastestLaps.car", "make model");
    res.status(200).json(tracks);
  } catch (err) {
    console.error("Error in getAllTracks:");
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getTrackById(req, res) {
  try {
    const track = await trackModel.findById(req.params.id).populate("fastestLaps.user fastestLaps.car");
    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }
    res.json(track);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

async function addTrack(req, res) {
  const { name, location, length, description, imageUrl } = req.body;
  const userId = req.body.userId;
  if (!name || !location || !length) {
    return res.status(400).json({ success: false, message: "Name, location and length are required" });
  }

  try {
    const newTrack = new trackModel({ name, location, length, description, imageUrl });
    await newTrack.save();
    await User.findByIdAndUpdate(userId, { $push: { tracks: newTrack._id } });
    res.status(201).json(newTrack);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add track" });
  }
}

async function updateTrack(req, res) {
  try {
    const updatedTrack = await trackModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTrack);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
}

async function deleteTrack(req, res) {
  try {
    await trackModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Track deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
async function addTrackForUser(req, res) {
  const { name, location, length, imageUrl, description } = req.body;
  const userId = req.body.userId;

  if (!userId) return res.status(400).json({ message: "User ID is required" });

  try {
    const newTrack = new trackModel({ name, location, length, imageUrl, description });
    await newTrack.save();

    // Добавяме пистата към потребителя
    await User.findByIdAndUpdate(userId, { $push: { tracks: newTrack._id } });

    res.status(201).json(newTrack); // връщаме новата писта
  } catch (error) {
    console.error("Failed to add track:", error);
    res.status(500).json({ message: "Failed to add track" });
  }
}

// async function addLap(req, res) {
//   const trackId = req.params.id;
//   const { userId, carId, time, conditions } = req.body;

//   if (!userId || !carId || !time) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     const track = await trackModel.findById(trackId);
//     if (!track) return res.status(404).json({ message: "Track not found" });

//     const newLap = { user: userId, car: carId, time, conditions };
//     track.fastestLaps.push(newLap);
//     await track.save();

//     // Populate for response
//     const populatedTrack = await track.populate("fastestLaps.user fastestLaps.car");

//     res.status(201).json(populatedTrack);
//   } catch (err) {
//     console.error("Failed to add lap:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// }

// controllers/tracksController.js


// async function addLap(req, res) {
//   try {
//     const track = await Track.findById(req.params.id);
//     if (!track) return res.status(404).json({ message: 'Track not found' });

//     const lap = {
//       user: req.body.user,
//       car: req.body.car,
//       time: req.body.time,
//       condition: req.body.condition
//     };

//     track.fastestLaps.push(lap);
//     await track.save();

//     const populatedLap = await Track.findById(req.params.id)
//       .populate('fastestLaps.user fastestLaps.car');

//     res.status(201).json(populatedLap.fastestLaps.slice(-1)[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to add lap' });
//   }
// }

// async function addLap(req, res) {
//   try {
//     const track = await Track.findById(req.params.trackId);
//     if (!track) {
//       return res.status(404).json({ message: "Track not found" });
//     }

//     const lap = {
//       user: req.user._id,          // 🔐 от auth
//       car: req.body.car,
//       time: Number(req.body.time), // ⏱ number
//     };

//     track.fastestLaps.push(lap);

//     track.fastestLaps.sort((a, b) => a.time - b.time);

//     await track.save();

//     const populatedTrack = await Track.findById(track._id)
//       .populate("fastestLaps.user", "username")
//       .populate("fastestLaps.car", "make model power");

//     res.status(201).json(
//       populatedTrack.fastestLaps[populatedTrack.fastestLaps.length - 1]
//     );
//   } catch (err) {
//     console.error("Add lap error:", err);
//     res.status(500).json({ message: "Failed to add lap" });
//   }
// }
// async function addLap(req, res) {
//   try {
    
//     const track = await Track.findById(trackId)
//   .populate("fastestLaps.user", "username") // само username
//   .populate("fastestLaps.car", "make model");

//     if (!track) {
//       return res.status(404).json({ message: "Track not found" });
//     }

//     const lap = {
//       user: req.user?._id || req.body.user,
//       car: req.body.car,
//       time: Number(req.body.time),
//     };

//     if (!lap.user || !lap.car || !lap.time) {
//       return res.status(400).json({ message: "Missing data" });
//     }

//     track.fastestLaps.push(lap);
//     track.fastestLaps.sort((a, b) => a.time - b.time);

//     await track.save();

//     const populatedTrack = await Track.findById(track._id)
//       .populate("fastestLaps.user", "username")
//       .populate("fastestLaps.car", "make model");

//     res.status(201).json(
//       populatedTrack.fastestLaps[populatedTrack.fastestLaps.length - 1]
//     );
//   } catch (err) {
//     console.error("Add lap error:", err);
//     res.status(500).json({ message: "Failed to add lap" });
//   }
// }
async function addLap(req, res) {
  try {
    const { trackId } = req.params; // ✅ ВАЖНО

    const track = await Track.findById(trackId)
      .populate("fastestLaps.user", "username")
      .populate("fastestLaps.car", "make model");

    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }

    const lap = {
      user: req.user?._id || req.body.user,
      car: req.body.car,
      time: Number(req.body.time),
      condition: req.body.condition || "dry",
    };

    if (!lap.user || !lap.car || !lap.time) {
      return res.status(400).json({ message: "Missing data" });
    }

    track.fastestLaps.push(lap);
    track.fastestLaps.sort((a, b) => a.time - b.time);

    await track.save();

    const populatedTrack = await Track.findById(track._id)
      .populate("fastestLaps.user", "username")
      .populate("fastestLaps.car", "make model");

    res.status(201).json(
      populatedTrack.fastestLaps[populatedTrack.fastestLaps.length - 1]
    );
  } catch (err) {
    console.error("Add lap error:", err);
    res.status(500).json({ message: "Failed to add lap" });
  }
}



async function deleteLap(req, res) {
  try {
    const { trackId, lapId } = req.params;
    const userId = req.user._id;

    const track = await Track.findById(trackId);
    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }

    const lap = track.fastestLaps.id(lapId);
    if (!lap) {
      return res.status(404).json({ message: "Lap not found" });
    }

    if (lap.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    lap.deleteOne();
    await track.save();

    res.status(200).json({ message: "Lap deleted" });
  } catch (err) {
    console.error("Delete lap error:", err);
    res.status(500).json({ message: "Server error" });
  }
}


module.exports = {
  getAllTracks,
  getTrackById,
  updateTrack,
  deleteTrack,
  addTrack,
  addTrackForUser,
  addLap,
  deleteLap,
};
