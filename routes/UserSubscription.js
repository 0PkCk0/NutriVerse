const router = require('express').Router();
const User = require('../model/UserModel');
const ProUser = require('../model/ProUserModel');
const verify = require('../config/verifyToken');
const mongoose = require('mongoose'); // Ensure mongoose is required

//request to enroll to a professionist
router.post('/', verify, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.body.subscriptionsId)) {
            return res.status(400).send('Invalid Professionist ID');
        }
        
        const subscriber = await User.findById(req.user._id); // Retrieve user by ID from req.user
        
        const professionistId = await req.body.subscriptionsId; // Retrieve professionist ID from req.body
        
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
            { $push: { requestId: req.user._id } },
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


// Accept new subscriber from a user (21)
router.put('/:acceptId', verify, async (req, res) => {
    const user = await User.findById(req.user);

    // Check if the user exists
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Check if he is a professionist
    if (user.Profession !== 'Nutritionist' && user.Profession !== 'Personal Trainer') {
        return res.status(400).send('User is not a professionist');
    }


    //Get a boolean value if I accept or deny the request of a user
    const ADRequest=req.body.ADRequest;
    const userID=req.params.acceptId;

    console.log(userID);
    if (user.requestId.includes(userID)){
        if (user.subscribersId.includes(userID)){
            await ProUser.findByIdAndUpdate(req.user,
                {$pull: { requestId: userID }});
            return res.status(404).json({ message: 'User already subscribed' });
        }else{
            if (ADRequest){
                ProUser.findByIdAndUpdate(req.user,
                    {$push: { subscribersId:userID }, $pull: { requestId: userID }},
                    { new:true }
                )
                    .then(doc=>{
                        return res.status(200).json({ message: 'User added' });
                    })
                    .catch(err=>{
                        console.log(err);
                        return res.status(200).json({ message: 'Error adding' });
                    });
            }

            else{
                ProUser.findByIdAndUpdate(req.user,
                    {$pull: { requestId: userID }},
                    { new:true }
                )
                    .then(doc=>{
                        return res.status(200).json({ message: 'User denied' });
                    })
                    .catch(err=>{
                        console.log(err);
                        return res.status(200).json({ message: 'Error dening' });
                    });
            }
        }
    }else{
        return res.status(404).json({ message: 'You don\'t have a request from this ID' });
    }
})

//unenroll from a professionist
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

// Get all the user's subscription ids (9)
router.get('/', verify, async (req, res) => {
    const user = await User.findById(req.user);

    // Check if the user exists
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // JSON variable to return to the caller
    const JSON_user= {
        subscriptions:user.subscriptionsId,
    };

    res.setHeader('Content-Type', 'application/json');
    res.json(JSON_user);
})


module.exports = router;
