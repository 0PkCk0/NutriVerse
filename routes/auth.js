const router = require('express').Router();
const User = require('../model/User');
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
        password: req.body.password,
        weight: req.body.weight,
        height: req.body.height,
        age: req.body.age,
        gender: req.body.gender
    })

    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err)
    }
})



module.exports = router;

