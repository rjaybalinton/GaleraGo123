const db = require('../config/db');
const bcrypt = require('bcrypt');

const UserModel = {
    // Create a new user (Register)
    createUser: (userData, callback) => {
        bcrypt.hash(userData.password, 10, (err, hashedPassword) => {
            if (err) {
                return callback(err, null);
            }
    
            const sql = `
                INSERT INTO users 
                (username, first_name, last_name, contact_number, email, password, date_of_birth, gender, nationality, address, profile_picture) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
    
            db.query(sql, [
                userData.username,
                userData.first_name,
                userData.last_name,
                userData.contact_number,
                userData.email,
                hashedPassword, // ✅ Store the hashed password
                userData.date_of_birth,
                userData.gender,
                userData.nationality,
                userData.address,
                userData.profile_picture || 'default.jpg'
            ], callback);
        });
    },
    

    // Find a user by email (for login)
    findByEmail: (email, callback) => {
        const sql = "SELECT * FROM users WHERE email = ?";
        db.query(sql, [email], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results[0]); // Return first user found
        });
    },

    // Find a user by ID
    getUserById: (id, callback) => {
        db.query('SELECT * FROM users WHERE user_id = ?', [id], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results[0]); // Return a single user
        });
    },

   
};

module.exports = UserModel;