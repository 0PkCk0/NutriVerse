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
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email not found');

    // Check if the user is confirmed
    if (!user.confirmed) return res.status(400).send('Please confirm your email before logging in');

    // Check if the password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    res.status(200).header('auth-token', token).send(token);
})

router.get('/', async (req, res) => {
    try {
        // Extract the token from the query parameters
        const token = req.query.token;
        if (!token) return res.status(400).send('Token is missing');

        // Verify the token
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        if (!verified) return res.status(400).send('Invalid token');

        // Find the user and update their confirmed status
        const user = await User.findById(verified._id);
        if (!user) return res.status(400).send('User not found');

        user.confirmed = true;
        await user.save();

        res.status(200).send('Email successfully confirmed. You can now log in.');
    } catch (err) {
        console.error('Error confirming email: ', err);
        res.status(500).send('Internal Server Error');
    }
});

//logout
router.delete('/', verify, async (req, res) => {
    if (req.body._id !== req.userId) return res.status(400).send('Invalid user');
    res.clearCookie('auth-token');
    return res.status(200).send('Logged out');
})

module.exports = router;

