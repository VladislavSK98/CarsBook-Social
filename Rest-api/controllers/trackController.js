const trackModel = require("../models/trackModel");

async function getAllTracks(req, res) {
  try {
    const tracks = await trackModel.find();
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

async function createTrack(req, res) {
  try {
    const newTrack = new trackModel(req.body);
    await newTrack.save();
    res.status(201).json(newTrack);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
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

async function addTrack(req, res) {
  const { name, location, laps, length, imageUrl } = req.body;
  try {
    const newTrack = new trackModel({ name, location, laps, length, imageUrl });
    await newTrack.save();
    res.status(201).json({ success: true, track: newTrack });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add track" });
  }
}

module.exports = {
  getAllTracks,
  getTrackById,
  createTrack,
  updateTrack,
  deleteTrack,
  addTrack
};
