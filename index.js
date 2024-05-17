const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Import routes
const authRoute = require('./routes/auth');
const subUser = require('./routes/UserSubscription');
const postRoute = require('./routes/posts');
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
app.use('/api/user', UserRoute);
app.use('/api/prouser', ProUserRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/subscription',subUser);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})