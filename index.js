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
app.use('/api/v1/upload', uploadRoute);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})