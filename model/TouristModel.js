const db = require('../config/db');

const TouristModel = {
    // ✅ Register a new tourist
    registerTourist: (data, callback) => {
        const sql = `
            INSERT INTO tourists (
                user_id,
                email,
                phone,
                first_name,
                last_name,
                age,
                gender,
                nationality,
                residence,
                companions_12,
                companions_below_12,
                arrival_date,
                departure_date,
                picture,
                accommodation
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.user_id,
            data.email,
            data.phone,
            data.first_name,
            data.last_name,
            data.age,
            data.gender,
            data.nationality,
            data.residence,
            data.companions_12,
            data.companions_below_12,
            data.arrival_date,
            data.departure_date,
            data.picture,
            data.accommodation
        ];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("❌ Error inserting tourist:", err);
                return callback(err, null);
            }
            callback(null, result);
        });
    },

    // ✅ Retrieve a tourist by ID
    getTouristById: (id, callback) => {
        const sql = "SELECT * FROM tourists WHERE tourist_id = ?";
        db.query(sql, [id], (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, result.length ? result[0] : null);
            }
        });
    }
};

module.exports = TouristModel;
