const Car = require("../models/cars");

const checkCarAvailability = async (req, res, next) => {
    const { carId, from, to } = req.body;

    try {
        const car = await Car.findById(carId);

        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        const isBooked = car.bookedTimeSlots.some(slot => {
            return (
                (new Date(slot.from) < new Date(to)) &&
                (new Date(slot.to) > new Date(from))
            );
        });

        if (isBooked) {
            return res.status(400).json({
                message: "Car is already booked for the specified time range. Please choose a different time or another vehicle.",
                alternatives: await suggestAlternativeCars(from, to, car.capacity, car.fuelType, car.rentPerHour) // Suggest alternatives if applicable
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const suggestAlternativeCars = async (from, to, capacity, fuelType, rentPerHour) => {
    try {
        const alternatives = await Car.find({
            capacity,
            fuelType,
            rentPerHour: { $lte: rentPerHour },
            bookedTimeSlots: {
                $not: {
                    $elemMatch: {
                        from: { $lt: to },
                        to: { $gt: from }
                    }
                }
            }
        });

        return alternatives;
    } catch (error) {
        console.error("Error suggesting alternative cars:", error.message);
        return [];
    }
};

module.exports = checkCarAvailability;
