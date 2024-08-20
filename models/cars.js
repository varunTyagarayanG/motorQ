const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    registrationNumber: { type: String, required: true, unique: true },

    name: { type: String, required: true },
    image: { type: String},
    capacity: { type: Number, required: true },
    fuelType: { type: String, required: true },

    bookedTimeSlots: [
      {
        from: { type: String},
        to: { type: String},
      },
    ],
    rentPerHour: { type: Number },
  },
  { timestamps: true }
);

const carModel = mongoose.model("cars", carSchema);
module.exports = carModel;
