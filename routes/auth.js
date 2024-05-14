const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const { registerValidation, loginValidation } = require('../routes/validation');

router.post('/register', async (req, res) => {
    // Validate data before creating a user
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if the user is already in the database
    const email = await User.findOne({ email: req.body.email });
    if (email) return res.status(400).send('Email already exists');

    // Check if the gender is valid
    // Convert validGenders to lowercase for comparison
    const validGenders = ['male', 'female', 'other'];

    // Check if the gender is valid
    if (!validGenders.includes(req.body.gender.toLowerCase())) {
    return res.status(400).send('Invalid gender');
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        weight: req.body.weight,
        height: req.body.height,
        age: req.body.age,
        gender: req.body.gender
    })

    const new_user = user.save()

    if (!new_user) return res.status(400).send('Error creating user');

    try {
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.status(201).header('auth-token', token).send(token);
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/login', async (req, res) => {
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

router.post('/logout', verify, async (req, res) => {
    if (req.body._id !== req.userId) return res.status(400).send('Invalid user');
    res.clearCookie('auth-token');
    return res.status(200).send('Logged out');
})

module.exports = router;

