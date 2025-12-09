const Garage = require('../models/garageModel');

exports.getGarageByUserId = async (req, res) => {
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
};

exports.addCarToGarage = async (req, res) => {
    try {
        const { carId } = req.body;

        const garage = await Garage.findOne({ user: req.params.userId });
        if (!garage) {
            return res.status(404).json({ message: 'Garage not found' });
        }

        if (!garage.cars.includes(carId)) {
            garage.cars.push(carId);
            await garage.save();
        }

        res.status(200).json({ message: 'Car added to garage' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add car to garage' });
    }
};


exports.updateCarInGarage = async (req, res) => {
    try {
        const { userId, carId } = req.params;
        const updatedData = req.body;

        const garage = await Garage.findOne({ user: userId });
        if (!garage) return res.status(404).json({ message: 'Garage not found' });

        const car = garage.cars.id(carId);
        if (!car) return res.status(404).json({ message: 'Car not found' });

        Object.assign(car, updatedData); // обновява само подадените полета
        await garage.save();

        res.json(car);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update car' });
    }
};

exports.deleteCarFromGarage = async (req, res) => {
    try {
        const { userId, carId } = req.params;

        const garage = await Garage.findOne({ user: userId });
        if (!garage) return res.status(404).json({ message: 'Garage not found' });

        const car = garage.cars.id(carId);
        if (!car) return res.status(404).json({ message: 'Car not found' });

        car.remove(); // премахва поддокумента
        await garage.save();

        res.json({ message: 'Car deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete car' });
    }
};
