const router = require('express').Router();
const User = require('../model/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const {registerValidation }= require('./validation');
const moment = require("moment-timezone");

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
        subscriptionsId: req.body.subscriptionsId,
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


// Change basic information of the user
router.put('/', verify, async (req, res) => {
    const user = await User.findById(req.user);

    //Check if the user exists
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const name=req.body.name;
    const weigth=req.body.weight;
    const age=req.body.age;
    const height=req.body.height;


    // Update of the fields of the user's schema.
    const updateField={};
    const pushField={};

    // Next we are going to check if the variables sent
    // in the body are empty or with some data:

    if (name!==undefined && name!==''){
        updateField.name=name;
    }

    if (age!==undefined && age!==''){
        updateField.age=age;
    }

    if (height!==undefined && height!==''){
        updateField.height=height;
    }

    if (weigth!==undefined && weigth!==''){

        var time = moment.tz(new Date(), "Europe/Rome");
        const returnTime=time.format('YYYY/MM/DD HH:mm');

        pushField.weight={
            value:parseInt(weigth, 10),
            date:returnTime
        };
        console.log(pushField);
    }

    // We update or push the data on the schema
    User.findByIdAndUpdate(req.user,
        {$set:updateField,$push: pushField },
        { new:true }
    )
        .then(doc=>{
            res.send("Updated data");
        })
        .catch(err=>{
            console.log(err);
            res.send("Error updating");
        });


})

// Get all the user's basic information
router.get('/', verify, async (req, res) => {
    const user = await User.findById(req.user);

    //Check if the user exists
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    //JSON variable to return to the caller
    const JSON_user= {
        name:user.name,
        email:user.email,
        weight:user.weight,
        height:user.height,
        age:user.age,
        gender:user.gender,
        timestap:user.timestamp,
    };

    // We set the header for returning the JSON variable
    res.setHeader('Content-Type', 'application/json');
    res.json(JSON_user);
})

module.exports = router;

