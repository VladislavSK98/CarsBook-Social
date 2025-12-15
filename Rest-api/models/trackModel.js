const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  length: { type: Number, required: true }, 
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fastestLaps: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      time: { type: Number, required: true }, 
      car: { type: mongoose.Schema.Types.ObjectId, ref: "Car" }, // Референция към кола
    },
  ],
  description: { type: String },
  imageUrl: { type: String }, // Снимка на пистата
});

const Track = mongoose.model("Track", trackSchema);
module.exports = Track;
