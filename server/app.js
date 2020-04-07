const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/users');
const awardRoutes = require('./routes/awards');
const authRoutes = require('./routes/auth');

app.use(bodyParser.json());
app.use('/uploads/avatars', express.static('uploads/avatars'));
app.use('/uploads/logos', express.static('uploads/logos'));
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/awards', awardRoutes);

module.exports = app;
