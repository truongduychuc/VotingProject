const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const winston = require('./config/winston');
const {HTTP} = require('./helpers/constants');
const queue = require('./queue');

const userRoutes = require('./routes/users');
const awardRoutes = require('./routes/awards');
const authRoutes = require('./routes/auth');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads/avatars', express.static('uploads/avatars'));
app.use('/uploads/logos', express.static('uploads/logos'));
app.use(cors());
app.use(morgan('combined', {
  stream: winston.stream
}));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/awards', awardRoutes);


module.exports = app;
