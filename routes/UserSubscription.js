const router = require('express').Router();
const User = require('../model/UserModel');
const ProUser = require('../model/ProUserModel');
const verify = require('../config/verifyToken');
const mongoose = require('mongoose'); // Ensure mongoose is required
const {sendUpdateUser}=require('../config/updateUser');

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

        // Check if the user is already subscribed or has already sent a request
        if ((subscriber.subscriptionsId && subscriber.subscriptionsId.includes(professionistId)) ||
            (professionist.requestId && professionist.requestId.includes(req.user._id))) {
            return res.status(400).send('User is already subscribed or has already sent a request');
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
            message: 'Request sent to Professionist',
            updatedUser,
            updatedProUser
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(400).send(err.message || 'An error occurred');
    }
});


// Accept or Deny new subscriber from a user (21)
router.put('/:acceptId', verify, async (req, res) => {
    const user = await User.findById(req.user);

    // Check if the user exists
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Check if he/she is a professionist
    if (user.Profession !== 'Nutritionist' && user.Profession !== 'Personal Trainer') {
        return res.status(400).send('User is not a professionist');
    }


    //Get a boolean value if I accept or deny the request of a user
    const ADRequest = req.body.ADRequest;
    const userID = req.params.acceptId;

    console.log(userID);
    if (user.requestId.includes(userID)) {
        if (user.subscribersId.includes(userID)) {
            await ProUser.findByIdAndUpdate(req.user,
                { $pull: { requestId: userID } });
            return res.status(404).json({ message: 'User already subscribed' });
        } else {
            if (ADRequest) {
                ProUser.findByIdAndUpdate(req.user,
                    { $push: { subscribersId: userID }, $pull: { requestId: userID } },
                    { new: true }
                )
                    .then(doc => {
                        return res.status(200).json({ message: 'User added' });
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(200).json({ message: 'Error adding' });
                    });
            }

            else {
                ProUser.findByIdAndUpdate(req.user,
                    { $pull: { requestId: userID } },
                    { new: true }
                )
                    .then(doc => {
                        return res.status(200).json({ message: 'User denied' });
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(200).json({ message: 'Error denying' });
                    });
            }
        }
    } else {
        console.log(user.requestId);
        return res.status(404).json({ message: 'You don\'t have a request from this ID' });
    }
})

router.delete('/:userId', verify, async (req, res) => {
    try {

        const requester = await User.findById(req.user); // Retrieve user by ID from req.user

        // Check if the request comes from a professional
        if ((requester.Profession === 'Nutritionist' || requester.Profession === 'Personal Trainer') && (!userToBeDisenrolled.Profession || userToBeDisenrolled.Profession === 'Premium user')) {
            // Retrieve the professional's ID from the request user
            const professionalId = req.user._id;

            // Retrieve the user's ID to be disenrolled from req.body
            const userId = req.params.userId;

            // Update the professional's document to remove the user from subscribers
            const updatedProUser = await ProUser.findByIdAndUpdate(
                professionalId,
                { $pull: { subscribersId: userId } },
                { new: true }
            );

            // Update the user's document to remove the professional from subscriptions
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $pull: { subscriptionsId: professionalId } },
                { new: true }
            );

            return res.status(200).json({
                message: 'User disenrolled by Professional',
                updatedUser,
                updatedProUser
            });
        }

        // If not a professional, proceed with the original function

        const subscriber = await User.findById(req.user._id); // Retrieve user by ID from req.user

        const professionistId = req.params.userId; // Retrieve professionist ID from req.body

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


// Get subscription or subscriber of the users (14)
router.get('/:userID', verify, async (req, res) => {
    const user = await User.findById(req.user);

    //Check if the user exists
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const userID = req.params.userID;

    //Check if we get the subscriptionId in the request parameters
    if (!userID){
        return res.status(404).json({ message: 'Id not found' });
    }


    //Check if we are subscribed to the user
    for (const id of user.subscriptionsId){
        if (id===userID){
            return await sendUpdateUser(res,userID);
        }
    }

    //Check if it is one of our subscriber
    for (const id of user.subscribersId){
        if (id===userID){
            return await sendUpdateUser(res,userID);
        }
    }


    //If we are not subscribed to him/her
    return res.status(404).json({ message: 'You are not subscribed to him/her or your subscription' });

});

// Get all the user's subscription ids (9)
router.get('/', verify, async (req, res) => {
    const user = await User.findById(req.user);

    // Check if the user exists
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    let response={
        subscriptions:[],
    };

    for (const id of user.subscriptionsId){
        const userSub=await User.findById(id);

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
        insert_push.code=userSub.Code;

        response.subscriptions.push(insert_push);
    }

    return res.status(200).json({ status: 200, subscriptions:response});
})


module.exports = router;
