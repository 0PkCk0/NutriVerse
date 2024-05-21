const router = require('express').Router();
const User = require('../model/UserModel');
const ProUser = require('../model/ProUserModel');
const verify = require('./verifyToken');
const mongoose = require('mongoose'); // Ensure mongoose is required

//enroll to a professionist
router.post('/', verify, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.body.subscriptionsId)) {
            return res.status(400).send('Invalid Professionist ID');
        }
        
        const subscriber = await User.findById(req.user._id); // Retrieve user by ID from req.user
        
        const professionistId = req.body.subscriptionsId; // Retrieve professionist ID from req.body
        
        const professionist = await ProUser.findById(professionistId); // Use professionistId to find ProUser
        
        if (!subscriber) return res.status(400).send('Subscriber not found');
        if (!professionist) return res.status(400).send('Professionist not found');
        
        // Check if the professionist is a premium user
        if (professionist.Profession === 'Premium user') {
            return res.status(400).send('Not a professionist');
        }
        
        // Check if the user is already subscribed
        if (subscriber.subscriptionsId && subscriber.subscriptionsId.includes(professionistId)) {
            return res.status(400).send('User is already subscribed');
        }

        // Update the user document using the User model
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $push: { subscriptionsId: professionistId } },
            { new: true }
        );

        const updatedProUser = await ProUser.findByIdAndUpdate(
            professionistId,
            { $push: { subscribersId: req.user._id } },
            { new: true }
        );

        res.status(200).json({
            message: 'User subscribed to Professionist',
            updatedUser,
            updatedProUser
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(400).send(err.message || 'An error occurred');
    }
});

router.delete('/', verify, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.body.subscriptionsId)) {
            return res.status(400).send('Invalid Professionist ID');
        }
        
        const subscriber = await User.findById(req.user._id); // Retrieve user by ID from req.user
        
        const professionistId = req.body.subscriptionsId; // Retrieve professionist ID from req.body
        
        const professionist = await ProUser.findById(professionistId); // Use professionistId to find ProUser
        
        if (!subscriber) return res.status(400).send('Subscriber not found');
        if (!professionist) return res.status(400).send('Professionist not found');
        
        // Check if the user is not subscribed
        if (!subscriber.subscriptionsId || !subscriber.subscriptionsId.includes(professionistId)) {
            return res.status(400).send('User is not subscribed');
        }

        // Update the user document using the User model
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { subscriptionsId: professionistId } },
            { new: true }
        );

        const updatedProUser = await ProUser.findByIdAndUpdate(
            professionistId,
            { $pull: { subscribersId: req.user._id } },
            { new: true }
        );

        res.status(200).json({
            message: 'User unsubscribed from Professionist',
            updatedUser,
            updatedProUser
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(400).send(err.message || 'An error occurred');
    }
});

module.exports = router;
