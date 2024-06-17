const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import routes
const authRoute = require('./routes/auth');
const subUser = require('./routes/UserSubscription');
const UserRoute = require('./routes/User');
const ProUserRoute = require('./routes/ProUser');
const uploadRoute = require('./routes/upload');
const reportRoute = require('./routes/report');
const messagesRoute = require('./routes/messages');

dotenv.config();


// Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to DB!');
  })
  .catch(err => {
    console.error('DB connection error:', err);
});

// Middleware
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', "true");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

// Route Middleware
app.use('/api/v1/user', UserRoute);
app.use('/api/v1/prouser', ProUserRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/subscription',subUser);
app.use('/api/v1/upload', uploadRoute);
app.use('/api/v1/report', reportRoute);
app.use('/api/v1/messages', messagesRoute);

module.exports = app;