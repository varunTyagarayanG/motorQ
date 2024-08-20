const express = require("express");
const router = express.Router();
const User = require("../models/user");

const Car = require("../models/cars");

const addCar = async (req, res) => {
  const { make, model, year, registrationNumber, name, capacity, fuelType } =
    req.body;

  try {
    const car = new Car({
      make,
      model,
      year,
      registrationNumber,
      name,
      capacity,
      fuelType,
    });

    const createdCar = await car.save();
    res.status(201).json(createdCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCars = async (req, res) => {
  try {
    const cars = await Car.find({});
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCar = async (req, res) => {
  const { make, model, year, registrationNumber } = req.body;

  try {
    const car = await Car.findById(req.params.id);

    if (car) {
      car.make = make || car.make;
      car.model = model || car.model;
      car.year = year || car.year;
      car.registrationNumber = registrationNumber || car.registrationNumber;

      const updatedCar = await car.save();
      res.json(updatedCar);
    } else {
      res.status(404).json({ message: "Car not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (car) {
      await car.remove();
      res.json({ message: "Car removed" });
    } else {
      res.status(404).json({ message: "Car not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchCars = async (req, res) => {
  const { make, model, year, registrationNumber } = req.query;

  try {
    const query = {};

    if (make) query.make = make;
    if (model) query.model = model;
    if (year) query.year = year;
    if (registrationNumber) query.registrationNumber = registrationNumber;

    const cars = await Car.find(query);
    res.json(cars);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addCar,
  getCars,
  updateCar,
  deleteCar,
  searchCars,
};
