const mongoose = require("mongoose");
const {Schema}=mongoose

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
    ratings: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
    inTransaction : {
      type : Boolean
    },
    rentPerHour: { type: Number },
  },
  { timestamps: true }
);
carSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) {
    return 0;
  }
  const total = this.ratings.reduce((sum, r) => sum + r.rating, 0);
  return total / this.ratings.length;
};

const carModel = mongoose.model("cars", carSchema);
module.exports = carModel;
