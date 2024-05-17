const User = require('../model/UserModel');
const ProUser = require('../model/ProUserModel');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const router = require('express').Router();
const moment = require('moment-timezone');
const mongoose = require('mongoose');

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

        if (!basicUser) return res.status(400).send('User not found');

        // Check if the user is already a ProUser
        if (basicUser.Profession === 'Nutritionist' || basicUser.Profession === 'Personal Trainer') {
            return res.status(400).send('User is already a Professionist and cannot update');
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

// Downgrade the plan of a ProUser
router.delete('/', verify, async (req, res) => {
    try {
        const proUser = await ProUser.findById(req.user._id);

        if (!proUser) return res.status(400).send('User not found');
        if (proUser.userType === 'User') {
            return res.status(400).send('User is not a ProUser');
        }

        let updates = {};
        let updatedUser;

        console.log('ProUser:', proUser);

        if (proUser.Profession === 'Premium User') {
            // Create a new User instance with the same data as the ProUser instance
            const newUser = new User({
                _id: proUser._id,
                name: proUser.name,
                email: proUser.email,
                password: proUser.password,
                weight: proUser.weight,
                height: proUser.height,
                age: proUser.age,
                gender: proUser.gender,
                subscriptionsId: proUser.subscriptionsId,
                userType: 'User',
                __t: 'User',
                timestamp: proUser.timestamp
            });

            console.log('New User:', newUser);

            // Delete the ProUser instance
            await ProUser.findByIdAndDelete(proUser._id);

            await newUser.save();
            const token = jwt.sign({ _id: newUser._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
            res.status(201).header('auth-token', token).send(token);

        } else if (['Nutritionist', 'Personal Trainer'].includes(proUser.Profession)) {
            updates = {
                Profession: 'Premium User',  // Downgrade to Premium User
                subscribersId: []  // Clear the subscribersId field
            };

            // Remove this ProUser's ID from the subscriptionsId array of every user who is subscribed to them
            await User.updateMany(
                { subscriptionsId: proUser._id },
                { $pull: { subscriptionsId: proUser._id } }
            );

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
            return res.status(400).send('Error updating user');
        }

        // Hydrate the document to ensure it conforms to the User model schema
        updatedUser = mongoose.model('User').hydrate(updatedUser);

        console.log('Updated User:', updatedUser);

        // Generate a new token
        const token = jwt.sign({ _id: updatedUser._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        res.status(201).header('auth-token', token).send(token);
    } catch (err) {
        console.error('Error:', err);
        if (!res.headersSent) {
            res.status(400).send(err.message || 'An error occurred');
        }
    }
});


module.exports = router;
