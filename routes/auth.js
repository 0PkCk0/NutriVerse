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

    try {
        const savedUser = await user.save();
        res.send({user: user._id});
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
    res.header('auth-token', token).send(token);
})

router.get('/logout', verify, async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.send('Logged out!');
})

module.exports = router;

