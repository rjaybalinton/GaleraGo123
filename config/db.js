const mysql = require('mysql2');
const db = mysql.createConnection({ // Correct the method name here
    host: 'localhost', 
    user: 'root',
    password: '',
    database: 'puerto galera'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

module.exports = db;