const router = require('express').Router();
const User = require('../model/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('../config/verifyToken');
const {registerValidation }= require('../config/validation');
const moment = require("moment-timezone");
const ProUser = require("../model/ProUserModel");
const transporter = require('../config/transporter');
const sanitizeInput = require('../config/sanitize');

//register
router.post('/', async (req, res) => {
    try {
        // Validate data before creating a user
        const data = sanitizeInput(req.body);
        const { error } = await registerValidation(data);
        if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

        // Check if the user is already in the database
        const emailExist = await User.findOne({ email: req.body.email });
        if (emailExist) return res.status(400).json({ status: 400, message: 'Email already exists' });

        // Check if the gender is valid
        if (req.body.gender) {
            let gender = req.body.gender;
            gender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
            req.body.gender = gender;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user object
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            weight: req.body.weight,
            height: req.body.height,
            age: req.body.age,
            gender: req.body.gender,
            subscriptionsId: req.body.subscriptionsId,
            userType: 'User',
            confirmed: false
        });

        // Save user to database
        const new_user = await user.save();
        if (!new_user) throw new Error('Error creating user');

        // Create a confirmation token
        const confirmationToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        // Send confirmation email
        let mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: req.body.email,
            subject: 'Please confirm your email',
            text: `Please confirm your email by clicking on the following link: 
            \nhttps://www.chess.com/home`
        };

        transporter.sendMail(mailOptions, function(err) {
            if (err) {
                console.error('Error sending email: ', err);
                return res.status(500).json({ status: 500, message: 'Technical Issue!, Please click on resend for verify your email.' });
            }
            res.status(200).json({ status: 200, message: 'A confirmation email has been sent to ' + req.body.email + '.' });
        });
    } catch (err) {
        console.error('Error in registration: ', err);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
});



// Change basic information of the user (5)
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
    const profession=req.body.profession;
    const confirmed = req.body.confirmed;


    // Update of the fields of the user's schema.
    const updateField={};
    const pushField={};

    // Next we are going to check if the variables sent
    // in the body are empty or with some data:

    // We check if the request parameter profession does exist, we check if the user is a prouser
    // and we check if the variable "profession" is a Nutritionist or Personal trainer
    if ((profession && profession!=='') && user.Profession && (profession==='Nutritionist' || profession==='Personal Trainer')){
        ProUser.findByIdAndUpdate(req.user,
            {$set: {Profession:profession}},
            { new:true }
        )
            .catch(err=>{
                res.send({ message: 'Error updating' });
            });
    }

    if (name!==undefined && name!==''){
        updateField.name=name;
    }

    if (age!==undefined && age!==''){
        updateField.age=age;
    }

    if (height!==undefined && height!==''){
        updateField.height=height;
    }

    if (confirmed!==undefined && confirmed!==''){
        updateField.confirmed=confirmed;
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
            res.send({ message: 'Updated data' });
        })
        .catch(err=>{
            console.log(err);
            res.send({ message: 'Error updating' });
        });

})


// Get subscription of the User (10)
router.get('/:subscriptionID', verify, async (req, res) => {
    const user = await User.findById(req.user);

    //Check if the user exists
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const subscriptionID = req.params.subscriptionID;

    //Check if we get the subscriptionId in the request parameters
    if (!subscriptionID){
        return res.status(404).json({ message: 'Id not found' });
    }


    //Check if we are subscribed to the user
    for (const id of user.subscriptionsId){
        if (id===subscriptionID){
            // We get the subscription
            const subUser = await User.findById(subscriptionID);

            //JSON variable to return to the caller
            const JSON_user= {
                name:subUser.name,
                weight:subUser.weight,
                height:subUser.height,
                age:subUser.age,
                gender:subUser.gender,
                timestap:subUser.timestamp,
                Profession:subUser.Profession,
                subscriptionEndDate:subUser.subscriptionEndDate,
                subscriptionStartDate:subUser.subscriptionStartDate
            };

            // We set the header for returning the JSON variable
            res.setHeader('Content-Type', 'application/json');
            res.json(JSON_user);

        }
    }

    //If we are not subscribed to him/her
    return res.status(404).json({ message: 'You are not subscribed to him/her or your subscription' });
})



// Get all the user's basic information (5)
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
        userType:user.userType,
        Profession:user.Profession,
        timestap:user.timestamp,
    };

    // We set the header for returning the JSON variable
    res.setHeader('Content-Type', 'application/json');
    res.json(JSON_user);
})

module.exports = router;

