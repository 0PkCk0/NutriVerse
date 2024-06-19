const router = require('express').Router();
const User = require('../model/UserModel');
const ProUser = require("../model/ProUserModel");
const verify = require("../config/verifyToken");

// Return the statistics of the subscriber of a Profession (26)
router.get('/:userID', verify, async (req, res) => {
    const user = await User.findById(req.user);

    //Check if the user exists
    if (!user) {
        return res.status(404).json({ status:404, message: 'User not found' });
    }

    // Check if he is a professionist
    if (user.Profession !== 'Nutritionist' && user.Profession !== 'Personal Trainer') {
        return res.status(404).json({ status: 404, message: 'User is not a professionist'});
    }

    const userID = req.params.userID;

    //Check if it is one of our subscriber
    for (const id of user.subscribersId){
        if (id===userID){
            subscriber=await User.findById(id);

            // Return the statistics of the specific subscriber
            return res.status(200).json({status:200, weights:subscriber.weight});
        }
    }

    return res.status(404).json({status:404, message:"Couldn't find the specified id"});
})


// Return the statistics of the user (26)
router.get('/', verify, async (req, res) => {
    const user = await User.findById(req.user);

    //Check if the user exists
    if (!user) {
        return res.status(404).json({ status:404, message: 'User not found' });
    }

    // We return the statistics of the user
    return res.status(200).json({ status:200, weights:user.weight });

})


module.exports = router;