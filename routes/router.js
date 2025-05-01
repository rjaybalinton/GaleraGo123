const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const authenticateToken = require('../controller/authMiddleware');
const multer = require("multer");
const upload = UserController.upload;
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

router.post('/register-tourist', authenticateToken, UserController.registerTourist);
// Show Registration Page
router.get('/', (req, res) => {
    res.render('LandingPage');
});
router.get('/register1', (req, res) => {
    res.render('UserRegister');
});
router.get("/user/home", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login"); // Redirect to login if not authenticated
    }
    res.render("UserHome", { user: req.session.user }); // Pass user data to view
});

router.get('/booking', (req, res) => {
    res.render('BookingPage');
});
router.get('/navigation', (req, res) => {
    res.render('navigation');
});
router.get('/AboutPage', (req, res) => {
    res.render('AboutPage');
});
router.get('/ContactPage', (req, res) => {
    res.render('ContactPage');
});
router.get('/FeaturesPage', (req, res) => {
    res.render('FeaturesPage');
});


// Forgot Password Routes
router.post("/forgot-password", UserController.forgotPassword);
router.post("/verify-code", UserController.verifyCode);
router.post("/reset-password", UserController.resetPassword);


// Handle User Registration
router.post('/register', UserController.register);

// Show Login Page
router.get('/login', (req, res) => {
    res.render('Userlogin');
});


// Handle User Login
router.post('/login', UserController.login);

// Handle User Logout
router.get('/logout', UserController.logout);

// Get User by ID
router.get('/user/:id', UserController.getUserById);


// Updated route with better error handling
router.post("/register2", upload.single("picture"), (req, res, next) => {
    // Check if user is authenticated
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized: Please log in first.' });
    }
    next();
}, UserController.registerTourist);

module.exports = router;