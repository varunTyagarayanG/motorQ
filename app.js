const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db'); 
const userRoutes = require('./routes/user')
dotenv.config();

const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/v1/user',userRoutes)
connectDB();

app.get('/', (req, res) => {
    res.send('Welcome to the carServices app!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
