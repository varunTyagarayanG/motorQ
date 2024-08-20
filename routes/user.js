const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user');

router.post("/login", userControllers.login); 
router.post("/register", userControllers.register); 

module.exports = router;
