const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user");

router.post("/login", userControllers.login);
router.post("/register", userControllers.register);

router.get("/getAvailableCars", userControllers.getAvailableCars);
router.post("/bookCar", userControllers.bookCar);
router.post("/filterCars", userControllers.filterCars);
module.exports = router;
