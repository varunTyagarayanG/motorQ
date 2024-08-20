//Level 0 Done!
const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db'); 
const ejs =  require('ejs');
const path = require('path');
const carModel = require('./models/cars')
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
dotenv.config();

const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/v1/user',userRoutes)
app.use('/v1/admin' ,adminRoutes)
connectDB();

app.get('/', (req, res) => {
    res.render('authentication');
});
app.get('/userDashboard',(req,res) =>{
    res.render('userDashboard');
});
app.get('/book', async (req, res) => {
    const carId = req.query._id;
    try {
        const car = await carModel.findById(carId).exec();
        if (!car) {
            return res.status(404).send('Car not found');
        }
        const averageRating = car.calculateAverageRating();
        const token = req.cookies.token || ''; // Get the token from cookies or any other source
        res.render('buyingDetails', {
            car: {
                ...car.toObject(),
                averageRating
            },
            token // Pass the token to the template
        });
    } catch (error) {
        console.error('Error fetching car details:', error);
        res.status(500).send('Server error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
