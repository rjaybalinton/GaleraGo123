const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql2');
const routes = require('./routes/router'); 

const session = require('express-session');
const app = express();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // or configure storage properly

// Use `upload.single('picture')` if you're uploading one image field named 'picture'

app.set('view engine', 'ejs');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(express.static('public'));

app.use('/', routes);
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));


app.listen(3233, () => {
    console.log('server running on http://localhost:3233');
});