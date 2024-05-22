const User = require('../model/UserModel');
const ProUser = require('../model/ProUserModel');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const router = require('express').Router();
const moment = require('moment-timezone');
const { get } = require('mongoose');

const getFormattedDate = function() {
    var time = moment.tz(new Date(), "Europe/Rome");
    return time.format('YYYY/MM/DD HH:mm');
}

const getFormattedDatePlusOneYear = function() {
    var time = moment.tz(new Date(), "Europe/Rome");
    return time.add(1, 'year').format('YYYY/MM/DD HH:mm');
}

// Update a user to ProUser
router.post('/', verify, async (req, res) => {
    try {
        const basicUser = await User.findById(req.user._id);

        if (!basicUser) return res.status(400).send('User not found');

        // Check if the user is already a ProUser
        if (basicUser.Profession === 'Nutritionist' || basicUser.Profession === 'Personal Trainer') {
            return res.status(400).send('User is already a Professionist and cannot update');
        }

        // Prepare the update data
        const updates = {
            Profession: req.body.Profession,
            subscriptionStartDate:getFormattedDate(),
            subscriptionEndDate: getFormattedDatePlusOneYear(),
            subscribersId: [],
            userType: 'ProUser'
        };

        // Update the user document using the ProUser model with overwriteDiscriminatorKey option

        if (basicUser.Profession === 'Premium user') {
            updatedUser = await ProUser.findOneAndUpdate({ _id: basicUser._id }, updates, {
                new: true,
                runValidators: true,
                context: 'query',
                overwriteDiscriminatorKey: true
            });
        } else {
            updatedUser = await User.findOneAndUpdate({ _id: basicUser._id }, updates, {
                new: true,
                runValidators: true,
                context: 'query',
                overwriteDiscriminatorKey: true
            });
        }
        console.log('Updated User:', updatedUser);

        if (!updatedUser) {
            return res.status(400).send('Error updating user to ProUser');
        }

        // Generate a new token
        const token = jwt.sign({ _id: updatedUser._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        res.status(201).header('auth-token', token).send(token);
    } catch (err) {
        console.error('Error:', err);
        res.status(400).send(err);
    }
});


// Get my subscribers
router.get('/', verify, async (req, res) => {
    const user = await User.findById(req.user);

    //Check if the user exists
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    console.log(user.Profession);
    // Check if the user is a ProUser
    if (user.Profession !== 'Nutritionist' && user.Profession !== 'Personal Trainer') {
        return res.status(400).send('User is not a professionist');
    }


    let resultJSON={
        subscribers:[]
    };

    for (const id of user.subscribersId){
        const userSub=User.findById(id);

        let insert_push={};

        insert_push.name=userSub.name;

        if (userSub.Profession === 'Nutritionist') {
            insert_push.profession='N'
        }else if(userSub.Profession === 'Personal Trainer'){
            insert_push.profession='P'
        }else{
            insert_push.profession='B'
        }

        // Index for selecting the user image in the main dashboard
        insert_push.index=1;

        console.log(insert_push);

        resultJSON.subscribers.push(insert_push);
    }

    // We set the header for returning the JSON variable
    res.setHeader('Content-Type', 'application/json');
    res.json(resultJSON);

});


module.exports = router;
