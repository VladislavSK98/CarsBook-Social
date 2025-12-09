const express = require('express');
const router = express.Router();
const Garage = require('../models/garageModel');
const carModel = require('../models/carModel');
const Track = require('../models/trackModel');
const { auth } = require('../utils');
const mongoose = require('mongoose');
// GET cars for logged-in user
router.get('/my-cars', auth(), async (req, res, next) => {
    try {
        const cars = await carModel.find({ userId: req.user._id });
        res.json(cars);
    } catch (err) {
        next(err);
    }
});

// GET garage by userId
router.get('/:userId', async (req, res) => {
    try {
        const garage = await Garage.findOne({ user: req.params.userId })
            .populate('cars')
            .populate('times')
            .populate('posts');

        if (!garage) {
            return res.status(200).json({
                cars: [],
                times: [],
                posts: [],
                tracks: [],
            });
        }

        res.json(garage);
    } catch (err) {
        res.status(500).json({ message: 'Server error loading garage' });
    }
});

// POST new car in garage + central Car model
router.post('/:userId/cars', auth(), async (req, res) => {
    try {
        const { make, model, year, imageUrl, mods, power, color } = req.body;
        const userId = req.params.userId;

        console.log('➡️  Adding car to garage for user:', userId);
        console.log('📦  Body:', req.body);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log('❌ Invalid userId');
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const car = await carModel.create({
            make,
            model,
            year,
            imageUrl,
            mods,
            power,
            color,
            userId
        });

        let garage = await Garage.findOne({ user: userId });
        if (!garage) {
            garage = new Garage({ user: new mongoose.Types.ObjectId(userId), cars: [] });
        }
        

        garage.cars.push(car._id);
        await garage.save();

        res.status(201).json(car);
    } catch (err) {
        console.error('❌ Error adding car to garage:', err); // 🧨 това ще ти покаже проблема
        res.status(500).json({ message: 'Failed to add car', error: err.message });
    }
});

router.post('/:userId/tracks', auth(), async (req, res) => {
    try {
        const { name, location, imageUrl } = req.body;
        const userId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const track = new Track({
            name,
            location,
            imageUrl,
            userId,
        });

        await track.save();

        let garage = await Garage.findOne({ user: userId });
        if (!garage) {
            garage = new Garage({ user: new mongoose.Types.ObjectId(userId), tracks: [] });
        }

        garage.tracks.push(track._id);
        await garage.save();

        res.status(201).json(track);
    } catch (err) {
        console.error('❌ Error adding track to garage:', err);
        res.status(500).json({ message: 'Failed to add track', error: err.message });
    }
});

module.exports = router;
