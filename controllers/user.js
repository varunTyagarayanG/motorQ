const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Car = require("../models/cars");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.send(user);
    } else {
      return res.status(400).json(error);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

exports.register = async (req, res) => {
  try {
    const newuser = new User(req.body);
    await newuser.save();
    res.send("User registered successfully");
  } catch (error) {
    return res.status(400).json(error);
  }
};

exports.getAvailableCars = async (req, res) => {
  const { from, to } = req.query;

  try {
    const cars = await Car.find({
      bookedTimeSlots: {
        $not: {
          $elemMatch: {
            from: { $lt: to },
            to: { $gt: from },
          },
        },
      },
    });

    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bookCar = async (req, res) => {
  const { carId, from, to } = req.body;

  try {
    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const isBooked = car.bookedTimeSlots.some((slot) => {
      return (
        new Date(slot.from) < new Date(to) && new Date(slot.to) > new Date(from)
      );
    });

    if (isBooked) {
      return res
        .status(400)
        .json({
          message: "Car is already booked for the specified time range",
        });
    }

    car.bookedTimeSlots.push({ from, to });
    await car.save();

    res.json({ message: "Car booked successfully", car });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.filterCars = async (req, res) => {
  const { make, model, year, fuelType, minRent, maxRent } = req.query;

  try {
      const query = {};

      if (make) query.make = make;
      if (model) query.model = model;
      if (year) query.year = year;
      if (fuelType) query.fuelType = fuelType;
      if (minRent || maxRent) {
          query.rentPerHour = {};
          if (minRent) query.rentPerHour.$gte = Number(minRent);
          if (maxRent) query.rentPerHour.$lte = Number(maxRent);
      }

      const cars = await Car.find(query);
      res.json(cars);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
