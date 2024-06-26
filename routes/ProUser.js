const User = require('../model/UserModel');
const ProUser = require('../model/ProUserModel');
const jwt = require('jsonwebtoken');
const verify = require('../config/verifyToken');
const router = require('express').Router();
const moment = require('moment-timezone');
const mongoose = require('mongoose');
const { sendUpdateUser } = require('../config/updateUser');

const getFormattedDate = function () {
    var time = moment.tz(new Date(), "Europe/Rome");
    return time.format('YYYY/MM/DD HH:mm');
}

const getFormattedDatePlusOneYear = function () {
    var time = moment.tz(new Date(), "Europe/Rome");
    return time.add(1, 'year').format('YYYY/MM/DD HH:mm');
}

// Update a user to ProUser
router.post('/', verify, async (req, res) => {
    try {
        const basicUser = await User.findById(req.user._id);

        if (!basicUser) return res.status(400).send({ code: 400, message: 'User not found' });

        if (req.body.Profession === "" || !req.body.Profession) {
            return res.status(400).send({ code: 400, message: 'Empty body Profession' });
        }

        // Check if the user is already a ProUser

        if (basicUser.Profession && (basicUser.Profession.includes('Nutritionist') || basicUser.Profession.includes('Personal Trainer'))) {
            return res.status(400).send({ code: 400, message: 'User is already a Professionist and cannot update' });
        }

        // Prepare the update data
        const updates = {
            Profession: req.body.Profession,
            subscriptionStartDate: getFormattedDate(),
            subscriptionEndDate: getFormattedDatePlusOneYear(),
            subscribersId: [],
            userType: 'ProUser'
        };

        // Update the user document using the ProUser model with overwriteDiscriminatorKey option

        if (basicUser.Profession === 'Premium User') {
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

        if (!updatedUser) {
            return res.status(400).send({ code: 400, message: 'Error updating user to ProUser' });
        }

        // Generate a new token
        const token = jwt.sign({ _id: updatedUser._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        res.status(201).header('auth-token', token).send({ code: 201, token: token });
    } catch (err) {
        console.error('Error:', err);
        res.status(400).send({ code: 400, message: err });
    }
});

// Downgrade the plan of a ProUser
router.delete('/', verify, async (req, res) => {
    const proUser = await ProUser.findById(req.user._id);
    try {
        if (!proUser) return res.status(400).json({ code: 400, message: 'User not found' });
        if (proUser.userType === 'User') {
            return res.status(400).json({ code: 400, message: 'User is not a ProUser' });
        }

        let updates = {};
        let updatedUser;

        if (proUser.Profession === 'Premium User') {
            // Create a new User instance with the same data as the ProUser instance
            const newUser = new User({
                name: proUser.name,
                email: proUser.email,
                password: proUser.password,
                weight: proUser.weight,
                height: proUser.height,
                plansUrl:proUser.plansUrl,
                age: proUser.age,
                gender: proUser.gender,
                subscriptionsId: proUser.subscriptionsId,
                userType: 'User',
                confirmed: true,
                __t: 'User',
                timestamp: proUser.timestamp
            });


            // Delete the ProUser instance
            await ProUser.findByIdAndDelete(proUser._id);

            await newUser.save();
            const token = jwt.sign({ _id: newUser._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
            return res.status(201).json({ code: 201, token: token });

        } else if (['Nutritionist', 'Personal Trainer'].includes(proUser.Profession)) {

            const subscribersId = proUser.subscribersId; 

            if (subscribersId && subscribersId.length > 0) {
                subscribersId.forEach(async (userEmail) => {
                    try {
                        // Find the user by their email
                        const user = await User.findOne({ email: userEmail });
                        if (user) {
                            // Assuming the user has a field 'subscriptions' which is an array of professional emails
                            await User.findByIdAndUpdate(user._id, { $pull: { subscriptionsId: proUser.email } });
                        }
                    } catch (error) {
                        console.error(`Error updating user ${userEmail}: ${error}`);
                        // Handle error appropriately, maybe accumulate errors to respond with or log them
                    }
                });
            }

            updates = {
                Profession: 'Premium User',  // Downgrade to Premium User
                subscribersId: []  // Clear the subscribersId field
            };

            updatedUser = await ProUser.findOneAndUpdate(
                { _id: proUser._id },
                updates,
                {
                    new: true,
                    runValidators: true,
                    context: 'query',
                    overwriteDiscriminatorKey: true
                }
            );
        }

        if (!updatedUser) {
            return res.status(400).json({ code: 400, message: 'Error updating user' });
        }

        // Hydrate the document to ensure it conforms to the User model schema
        updatedUser = mongoose.model('User').hydrate(updatedUser);


        // Generate a new token
        const token = jwt.sign({ _id: updatedUser._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        res.status(201).header('auth-token', token).json({ code: 201, token: token });
    } catch (err) {
        console.error('Error:', err);
        if (!res.headersSent) {
            res.status(400).json({ code: 400, message: err.message || 'An error occurred' });
        }
    }
});

// Get subscriber of the Prousers (23)
router.get('/:userID', verify, async (req, res) => {
    const user = await User.findById(req.user);

    //Check if the user exists
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const userID = req.params.userID;

    //Check if we get the subscriptionId in the request parameters
    if (!userID) {
        return res.status(404).json({ message: 'Id not found' });
    }

    //Check if it is one of our subscriber
    for (const id of user.subscribersId) {
        if (id === userID) {
            return await sendUpdateUser(res, userID);
        }
    }

    //If we are not subscribed to him/her
    return res.status(404).json({ message: 'He/she is not subscribed to you' });

});


/// Get my subscribers (20)
router.get('/', verify, async (req, res) => {
    const user = await User.findById(req.user);

    // Check if the user exists
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is a ProUser
    if (!user.Profession) {
        return res.status(400).send('User is not a ProUser');
    }

    // Check if he is a professionist
    if (user.Profession !== 'Nutritionist' && user.Profession !== 'Personal Trainer') {
        return res.status(400).send('User is not a professionist');
    }

    let resultJSON = {
        subscribers: [],
        requests: [] // Add the requests array here
    }

    // Populate subscribers array
    for (const mail of user.subscribersId) {
        const userSub_query = await User.findOne({ email: mail });
        const userSub = userSub_query;
        let insert_push = {};

        if (userSub.name) {
            insert_push.name = userSub.name;
        }
        insert_push.email = userSub.email;

        if (userSub.Profession === 'Nutritionist') {
            insert_push.profession = 'N'
        } else if (userSub.Profession === 'Personal Trainer') {
            insert_push.profession = 'P'
        } else {
            insert_push.profession = 'B'
        }

        // Index for selecting the user image in the main dashboard
        insert_push.index = 1;
        insert_push.code = userSub.Code;

        resultJSON.subscribers.push(insert_push);
    }

    // Populate requests array
    for (const mail of user.requestId) {
        const userReq_query = await User.findOne({ email: mail });
        const userReq = userReq_query;
        let insert_push = {};

        insert_push.email = userReq.email;

        if (userReq.Profession === 'Nutritionist') {
            insert_push.profession = 'N'
        } else if (userReq.Profession === 'Personal Trainer') {
            insert_push.profession = 'P'
        } else {
            insert_push.profession = 'B'
        }

        // Index for selecting the user image in the main dashboard
        insert_push.index = 1;
        insert_push.code = userReq.Code;

        resultJSON.requests.push(insert_push);
    }

    return res.status(200).json({ status: 200, subscribers: resultJSON.subscribers, requests: resultJSON.requests });
});


module.exports = router;
