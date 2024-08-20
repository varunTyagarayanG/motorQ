const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
const User = require("../models/user");
const Car = require("../models/cars");
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken')
dotenv.config();

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new Error("Please provide email");
    }
    if (!password) {
      throw new Error("Please provide password");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    console.log("checkPassoword", checkPassword);

    if (checkPassword) {
      const tokenData = {
        _id: user._id,
        email: user.email,
      };
      const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
        expiresIn: 60 * 60 * 8,
      });

      const tokenOption = {
        httpOnly: true,
        secure: true,
      };

      res.cookie("token", token, tokenOption).status(200).json({
        message: "Login successfully",
        data: token,
        success: true,
        error: false,
      });
    } else {
      throw new Error("Please check Password");
    }
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

exports.register = async (req, res) => {
    try {
      const { email, password, name, username} = req.body;
      const user = await User.findOne({ email });
      console.log("user", user);
  
      if (user) {
        throw new Error("Already user exits.");
      }
      if (!email) {
        throw new Error("Please provide email");
      }
      if (!password) {
        throw new Error("Please provide password");
      }
      if (!name) {
        throw new Error("Please provide name");
      }
  
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = await bcrypt.hashSync(password, salt);
  
      if (!hashPassword) {
        throw new Error("Something is wrong");
      }
  
      const payload = {
        name :name ,
        username : username ,
        password : hashPassword,
        email : email
      };
  
      const userData = new User(payload);
      const saveUser = await userData.save();
  
      res.status(201).json({
        data: saveUser,
        success: true,
        error: false,
        message: "User created Successfully!",
      });
    } catch (err) {
      res.json({
        message: err.message || err,
        error: true,
        success: false,
      });
    }
  };


  //Other options for users Other than loggin in !
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
    if (!carId || !from || !to) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const car = await Car.findById(carId);
    if(car.inTransaction){
      return res.status(400).json({
        message: "SomeOne Is Booking This car..ans he is first in link",
      });
    }
    car.inTransaction = true ;
    const carDetails = {
      carname : car.name,
      carsize : car.capacity,
      carFuel : car.fuelType,
      registrationNumber : car.registrationNumber ,
      carname : car.name,
    }
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const isBooked = car.bookedTimeSlots.some(slot => {
      car.inTransaction = false 
      return (
        (new Date(slot.from) < new Date(to) && new Date(slot.to) > new Date(from))
      );
    });

    if (isBooked) {
      return res.status(400).json({
        message: "Car is already booked for the specified time range",
      });
    }

    car.bookedTimeSlots.push({ car, from, to });
    await car.save();

    const user = await User.findById(req.userId);
    if (user) {
      user.bookings.push({ carDetails, from, to });
      await user.save();
    }

    // await sendBookingConfirmationEmail(user, car, { from, to });

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
exports.submitRating = async (req, res) => {
  const { carId, rating } = req.body;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5 stars." });
  }

  try {
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Add the rating
    car.ratings.push({ userId: req.userId, rating });
    car.averageRating = car.calculateAverageRating();

    await car.save();

    res.json({ message: "Thank you for your feedback!", car });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
