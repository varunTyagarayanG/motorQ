const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/admin');

router.post('/addCars' , adminControllers.addCar)
router.post('/getCars' , adminControllers.getCars)

module.exports = router;
