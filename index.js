const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const body_parser = require('body-parser');

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


app.use(morgan('dev'));
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})