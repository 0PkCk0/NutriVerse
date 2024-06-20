const router = require('express').Router();
const User = require('../model/UserModel');
const ProUser = require("../model/ProUserModel");
const verify = require("../config/verifyToken");

// Return the statistics of the subscriber of a Profession (26)
router.get('/:userEmail', verify, async (req, res) => {
    reqEmail = User.findById(req.user).email;
    if (reqEmail === req.params.userEmail) {
        const user = await User.findById(req.user);
        // We return the statistics of the user
        return res.status(200).json({ status: 200, weights: user.weight });
    } else {
        const user = await User.findById(req.user);

        //Check if the user exists
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        // Check if he is a professionist
        if (user.Profession !== 'Nutritionist' && user.Profession !== 'Personal Trainer') {
            return res.status(404).json({ status: 404, message: 'User is not a professionist' });
        }

        const userEmail = req.params.userEmail;

        //Check if it is one of our subscriber
        for (const id of user.subscribersId) {
            if (id === userEmail) {
                subscriber = await User.findOne({ email: userEmail });

                if (subscriber) {
                    // Return the statistics of the specific subscriber
                    return res.status(200).json({ status: 200, weights: subscriber.weight });
                } else {
                    return res.status(400).json({ status: 400, message: "Can't find the user" });
                }
            }
        }

        return res.status(404).json({ status: 404, message: "Couldn't find the specified email" });
    }
})


// Return the statistics of the user (26)
router.get('/', verify, async (req, res) => {
    const user = await User.findById(req.user);

    //Check if the user exists
    if (!user) {
        return res.status(404).json({ status: 404, message: 'User not found' });
    }

    // We return the statistics of the user
    return res.status(200).json({ status: 200, weights: user.weight });

})


module.exports = router;