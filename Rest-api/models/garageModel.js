const mongoose = require('mongoose');

const timeSchema = new mongoose.Schema({
    trackName: String,
    carName: String,
    time: String,
    date: Date,
});

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: Date,
});

const trackSchema = new mongoose.Schema({
    trackName: String,
    location: String,
    length: Number,
    imageUrl: String,
});

const garageSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    cars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }], // <-- важно!
    times: [timeSchema],
    posts: [postSchema],
    tracks: [trackSchema],
});

module.exports = mongoose.model('Garage', garageSchema);
