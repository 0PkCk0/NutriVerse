const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Import routes
const authRoute = require('./routes/auth');
const subUser = require('./routes/UserSubscription');
const UserRoute = require('./routes/User');
const ProUserRoute = require('./routes/ProUser');

dotenv.config();


const port = 3000;


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

// Route Middleware
app.use('/api/v1/user', UserRoute);
app.use('/api/v1/prouser', ProUserRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/subscription',subUser);


// app.use((req, res, next) => {
//  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
//  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//  next();
//});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})