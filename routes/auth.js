const router = require('express').Router();
const User = require('../model/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const { loginValidation } = require('../routes/validation');

//login
router.post('/', async (req, res) => {
    // Validate data before logging in
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if the email exists
    const email = await User.findOne({ email: req.body.email });
    if (!email) return res.status(400).send('Email not found');

    // Check if the password is correct
    const validPass = await bcrypt.compare(req.body.password, email.password);
    if (!validPass) return res.status(400).send('Invalid password');

    const token = jwt.sign({ _id: email._id }, process.env.TOKEN_SECRET);
    res.status(200).header('auth-token', token).send(token);
})

//logout
router.delete('/', verify, async (req, res) => {
    if (req.body._id !== req.userId) return res.status(400).send('Invalid user');
    res.clearCookie('auth-token');
    return res.status(200).send('Logged out');
})

module.exports = router;

