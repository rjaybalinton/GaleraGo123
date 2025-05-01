const TouristModel = require('../model/TouristModel');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const authenticateUser = (req, res, next) => { 
    const token = req.header('Authorization'); // Get token from request header

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
        req.user = decoded; // Attach user data to request
        next(); // Proceed to the next middleware or controller function
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

const TouristController = {
    registerTourist1: (req, res) => {  
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({ error: 'Unauthorized: Please log in first.' });
        }

        const touristData = {
            user_id: req.user.user_id,  // Get user_id from decoded token
            email: req.body.email,
            phone: req.body.phone,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            age: req.body.age,
            gender: req.body.gender,
            nationality: req.body.nationality,
            residence: req.body.residence,
            companions_12: req.body.companions_12 || 0,
            companions_below_12: req.body.companions_below_12 || 0,
            arrival_date: req.body.arrival_date,
            departure_date: req.body.departure_date,
            picture: req.body.picture || 'default.jpg',
            accommodation: req.body.accommodation
        };

        // Call the model function to insert data
        TouristModel.registerTourist1(touristData, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error', details: err });
            }
            res.status(201).json({ message: 'Tourist registered successfully', touristId: result.insertId });
        });
    }
};

module.exports = { authenticateUser },
module.exports = { TouristController };
