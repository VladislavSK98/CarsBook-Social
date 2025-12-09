const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { carsController} = require('../controllers');

// middleware that is specific to this router

router.put('/:carId/like', auth(), carsController.likeCar);

module.exports = router
