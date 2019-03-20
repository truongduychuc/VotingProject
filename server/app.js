const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/users');

app.use(bodyParser.json());
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);



app.use('/users', userRoutes);


module.exports = app;