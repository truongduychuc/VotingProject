const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/users');
const awardRoutes = require('./routes/awards')

app.use(bodyParser.json());
app.use('/users/uploads', express.static('uploads'))
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);



app.use('/users', userRoutes);
app.use('/awards', awardRoutes);

module.exports = app;