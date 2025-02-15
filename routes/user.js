const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user");
const isCarAvailable = require('../middlewares/IsCarAvailable')
const authToken = require('../middlewares/authToken')

router.post("/login", userControllers.login);
router.post("/register", userControllers.register);

router.get("/getAvailableCars",authToken ,userControllers.getAvailableCars);
router.post("/bookCar",authToken ,userControllers.bookCar);
router.post("/filterCars",authToken ,userControllers.filterCars);
router.post("/submitRating" ,userControllers.submitRating);
module.exports = router;
