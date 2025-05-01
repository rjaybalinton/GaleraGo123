const bcrypt = require('bcrypt');
const User = require('../model/UserModel'); // ✅ Make sure the path is correct
const TouristModel= require('../model/TouristModel');
const db = require('../config/db');
const multer = require("multer") 
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Save files in 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"), false);
        }
    }
});



const UserController = {
    // User Registration
    register: (req, res) => {
        const newUser = req.body;

        // Check if email already exists
        User.findByEmail(newUser.email, (err, existingUser) => {  
            if (err) return res.status(500).json({ error: 'Database error' });
            if (existingUser) return res.status(400).json({ error: 'Email already registered' });

            // Save new user
            User.createUser(newUser, (err, result) => {  
                if (err) return res.status(500).json({ error: 'Error creating user' });
                res.status(201).json({ message: 'User registered successfully', user_id: result.insertId });
            });
        });
    },

    // User Login
    login: (req, res) => {
        const { email, password } = req.body;
    
        console.log("Login Attempt for:", email);
    
        User.findByEmail(email, (err, user) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
    
            if (!user || !user.password) {
                console.error("Invalid email or password - User Not Found");
                return res.status(401).json({ error: "Invalid email or password" });
            }
    
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error("Password comparison error:", err);
                    return res.status(500).json({ error: "Error comparing passwords" });
                }
    
                if (!isMatch) {
                    console.log("Passwords do not match!");
                    return res.status(401).json({ error: "Invalid email or password" });
                }
    
                console.log("Login successful!");
                req.session.user = user; // ✅ Store user session
    
                // ✅ Redirect user to UserHome.ejs after successful login
                return res.redirect("/user/home");
            });
        });
    },
    
    
    

    // Get User by ID
    getUserById: (req, res) => {
        const { id } = req.params;

        User.getUserById(id, (err, user) => {  // ✅ Changed UserModel to User
            if (err) return res.status(500).json({ error: 'Database error' });
            if (!user) return res.status(404).json({ error: 'User not found' });

            res.json(user);
        });
    },

    

    
    logout:(req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Failed to logout");
            }
            res.redirect('/'); // Redirect to login page after logout
        });
    },
    // Forgot Password - Generate and Send Code
    forgotPassword : async (req, res) => {
        const { email } = req.body;
    
        try {
            // Check if the email exists in the database
            const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    
            if (!user || user.length === 0) {
                return res.status(404).json({ message: "Email not found in our records" });
            }
    
            // Generate a secure reset token (6-digit code)
            const resetCode = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
            const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // Code valid for 15 minutes
    
            // Store reset code and expiration time in the database
            await db.query("UPDATE users SET reset_code = ?, reset_expiry = ? WHERE email = ?", [resetCode, expirationTime, email]);
    
            // Configure Nodemailer
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "rjaybalinton833@gmail.com", // Hardcoded email
                    pass: "Rj@ybalinton26" // ⚠️ Use an App Password instead of your real password
                },
            });
    
            // Email options
            const mailOptions = {
                from: "rjaybalinton833@gmail.com",
                to: email,
                subject: "Password Reset Code - GaleraGo",
                text: `Your password reset code is: ${resetCode}. This code is valid for 15 minutes.`
            };
    
            // Send email
            await transporter.sendMail(mailOptions);
    
            res.json({ message: "A reset code has been sent to your email." });
        } catch (error) {
            console.error("Error in forgot password:", error);
            res.status(500).json({ message: "An error occurred. Please try again later." });
        }
    }, 
    verifyCode : (req, res) => {
        const { email, code } = req.body;
        if (verificationCodes[email] === code) {
            return res.json({ message: "Code verified!" });
        }
        res.status(400).json({ message: "Invalid code!" });
    },
    resetPassword : async (req, res) => {
        const { email, newPassword } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await db.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);
            delete verificationCodes[email];
    
            res.json({ message: "Password successfully reset!" });
        } catch (error) {
            res.status(500).json({ message: "Server error!" });
        }
    },
    registerTourist: (req, res) => {
        console.log("🔹 Session Data:", req.session);
        console.log("🔹 User in Session:", req.session.user);
    
        // Check if user is authenticated
        if (!req.session.user || !req.session.user.user_id) {
            return res.status(401).json({ error: 'Unauthorized: Please log in first.' });
        }
    
        // Convert req.body to a plain object to avoid null prototype issues
        req.body = Object.assign({}, req.body);
    
        console.log("✅ Received Body Data:", req.body);
        console.log("✅ Uploaded File:", req.file ? req.file.filename : "No file uploaded");
    
        // Check if required fields exist
        const requiredFields = ['email', 'phone', 'first_name', 'last_name', 'age', 'gender', 
                               'nationality', 'residence', 'arrival_date', 'departure_date', 
                               'accommodation'];
        
        const missingFields = [];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                missingFields.push(field);
            }
        }
        
        if (missingFields.length > 0) {
            console.error("❌ Missing required fields:", missingFields);
            return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
        }
    
        if (!req.file) {
            console.error("❌ No file uploaded");
            return res.status(400).json({ error: 'Please upload a picture' });
        }
    
        const picture = req.file ? req.file.filename : 'default.jpg';
    
        const touristData = {
            user_id: req.session.user.user_id,
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
            picture: picture,
            accommodation: req.body.accommodation
        };
    
        TouristModel.registerTourist(touristData, (err, result) => {
            if (err) {
                console.error("❌ Database Error:", err.sqlMessage || err);
                return res.status(500).json({ error: 'Database error', details: err.message });
            }
            console.log("✅ Tourist Registered Successfully:", result.insertId);
            res.status(201).json({ message: 'Tourist registered successfully', touristId: result.insertId });
        });
    }
    

  
};

// ✅ Correct module.exports
module.exports = UserController;
module.exports.upload = upload;