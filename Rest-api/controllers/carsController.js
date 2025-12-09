const { userModel, carModel } = require('../models');
const Garage = require('../models/garageModel'); 

function newCar(make, model, year, mods,userId, power, color, imageUrl) {
    return carModel.create({ make, model, year, mods, userId, power, color, imageUrl })
        .then(car => {
            return userModel.updateOne(
                { _id: userId },
                { $push: { cars: car._id } }
            ).then(() => car);
        });
}

function createCar(req, res, next) {
    const { _id: userId } = req.user;
    const { make, model, year, power, color, imageUrl, mods } = req.body;

    newCar(make, model, year, userId, power, color, imageUrl, mods)
        .then(async (car) => {
            // Добавяне и в гаража:
            let garage = await Garage.findOne({ user: userId });
            if (!garage) {
                garage = new Garage({ user: userId, cars: [] });
            }

            garage.cars.push(car._id);
            await garage.save();

            res.status(201).json(car);
        })
        .catch(next);
}
function getCarsByUserId(req, res, next) {
    const { userId } = req.params;  
    carModel.find({ userId })
        .populate('userId', 'username')  
        .then(cars => res.status(200).json(cars))
        .catch(next);
}


function getAllCars(req, res, next) {
    carModel.find()
        .populate('userId', 'username') 
        .then(cars => 
            {
                const carsWithLikes = cars.map(car => ({
                    ...car.toObject(),
                    likesCount: car.likes.length, 
                }));
                res.status(200).json(carsWithLikes);
            })
            .catch(next);
            
}

function editCar(req, res, next) {
    const { carId } = req.params;
    const { make, model, year, power, color, imageUrl, mods } = req.body;
    const { _id: userId } = req.user;

    console.log('🔧 Request to edit by user:', userId);

    carModel.findById(carId).then(car => {
        if (!car) {
            console.log('🚫 Car not found');
            return res.status(404).json({ message: 'Car not found' });
        }
        console.log('📦 Found car, owner:', car.userId.toString());
        console.log('👤 Requesting user:', userId.toString());
    });
    

    carModel.findOneAndUpdate(
        { _id: carId, },
        { make, model, year, power, color, imageUrl, mods },
        { new: true }
    )
        .then(updatedCar => {
            if (updatedCar) {
                res.status(200).json(updatedCar);
            } else {
                res.status(401).json({ message: 'Not allowed!' });
            }
        })
        .catch(next);
}

function deleteCar(req, res, next) {
    const { carId } = req.params;
    const { _id: userId } = req.user;

    Promise.all([
        carModel.findOneAndDelete({ _id: carId, userId }),
        userModel.updateOne({ _id: userId }, { $pull: { cars: carId } })
    ])
        .then(([deletedCar]) => {
            if (deletedCar) {
                res.status(200).json({ message: 'Car deleted successfully!' });
            } else {
                res.status(401).json({ message: 'Not allowed!' });
            }
        })
        .catch(next);
}

function getCarDetails(req, res, next) {
    const { carId } = req.params;

    carModel.findById(carId)  
        .then(car => {
            if (car) {
                
                const carWithLikes = {
                    ...car.toObject(),
                    likesCount: car.likes.length,  
                };

                res.status(200).json(carWithLikes);  
            } else {
                res.status(404).json({ message: 'Car not found' });
            }
        })
        .catch(next);
}


async function likeCar(req, res, next) {
    const { carId } = req.params;
    const { _id: userId } = req.user;

    try {
        const car = await carModel.findById(carId);
        if (!car) return res.status(404).json({ message: 'Car not found' });

        const alreadyLiked = car.likes.includes(userId);
        if (alreadyLiked) {
            car.likes = car.likes.filter(id => id.toString() !== userId.toString());
        } else {
            car.likes.push(userId);
        }

        await car.save();
        res.status(200).json({ message: alreadyLiked ? 'Unliked car' : 'Liked car' });
    } catch (err) {
        next(err);
    }
}


module.exports = {
    getAllCars,
    newCar,
    createCar,
    editCar,
    deleteCar,
    likeCar,
    getCarsByUserId,
    getCarDetails,
};