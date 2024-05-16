const router = require('express').Router();
const User = require('../model/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const {registerValidation }= require('./validation');

router.post('/', async (req, res) => {
    // Validate data before creating a user
    const { error } = await registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if the user is already in the database
    const email = await User.findOne({ email: req.body.email });
    if (email) return res.status(400).send('Email already exists');

    //Check if the gender is valid
    const validGenders = ['male', 'female', 'other'];

    // Check if the gender is valid
    if (req.body.gender) {
        if (!validGenders.includes(req.body.gender.toLowerCase())) return res.status(400).send('Invalid gender');
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
        gender: req.body.gender,
        userType: 'User'
    })

    const new_user = await user.save()

    if (!new_user) return res.status(400).send('Error creating user');

    try {
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        res.status(201).header('auth-token', token).send(token);
    } catch (err) {
        res.status(400).send(err)
    }
})

router.put('/:id', verify, async (req, res) => {

})

module.exports = router;

