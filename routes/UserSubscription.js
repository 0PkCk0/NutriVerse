const router = require('express').Router();
const User = require('../model/UserModel');
const ProUser = require('../model/ProUserModel');
const verify = require('../config/verifyToken');
const { sendUpdateUser } = require('../config/updateUser');

//request to enroll to a professionist
router.post('/', verify, async (req, res) => {
    try {
        // Retrieve subscriber (user) information
        const subscriber = await User.findById(req.user._id);

        if (!subscriber) {
            return res.status(400).send({ message: 'Subscriber not found' });
        }

        // Retrieve professionist information based on email
        const professionistEmail = req.body.email; // Assuming email is in req.body
        const query = await ProUser.findOne({ email: professionistEmail });
        const professionist = query;

        if (!professionist) {
            return res.status(400).send({ message: 'Professionist not found' });
        }

        // Check if professionist is a premium user (not allowed)
        if (professionist.Profession === 'Premium User') {
            return res.status(400).send({ message: 'Professionist is a Premium user' });
        }

        // Check for existing subscription or pending request
        if ((subscriber.subscriptionsId && subscriber.subscriptionsId.includes(professionistEmail)) ||
            (professionist.requestId && professionist.requestId.includes(req.user.email))) {
            return res.status(400).send({ message: 'Subscription already exists or request pending' });
        }

        // Update user document (add professionist ID to subscriptions)
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $push: { subscriptionsId: professionistEmail } },
            { new: true }
        );

        // Update professionist document (add user ID to request list)
        const updatedProUser = await ProUser.findByIdAndUpdate(
            professionist._id.toHexString(),
            { $push: { requestId: subscriber.email } },
            { new: true }
        );

        return res.status(200).json({ status: 200, message: 'Request sent to Professionist' });

    } catch (err) {
        console.error('Error:', err);
        res.status(400).send({ message: 'An error occurred' });
    }
});



// Accept or Deny new subscriber from a user (21)
router.put('/', verify, async (req, res) => {
    const user = await User.findById(req.user);

    // Check if the user exists
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Check if he/she is a professionist
    if (user.Profession !== 'Nutritionist' && user.Profession !== 'Personal Trainer') {
        return res.status(400).json({ message: 'User is not a professionist' });
    }


    //Get a boolean value if I accept or deny the request of a user
    const ADRequest = req.body.ADRequest;
    const userEmail = req.body.acceptEmail;

    if (user.requestId.includes(userEmail)) {
        if (user.subscribersId.includes(userEmail)) {
            await ProUser.findByIdAndUpdate(req.user,
                { $pull: { requestId: userEmail } });
            return res.status(404).json({ message: 'User already subscribed' });
        } else {
            if (ADRequest === true) {
                ProUser.findByIdAndUpdate(req.user,
                    { $push: { subscribersId: userEmail }, $pull: { requestId: userEmail } },
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
                await ProUser.findByIdAndUpdate(req.user,
                    { $pull: { requestId: userEmail } },
                    { new: true }
                );


                const updatedUser = await User.findOneAndUpdate(
                    { email: userEmail },
                    { $pull: { subscriptionsId: user.email } },
                    { new: true }
                );

                return res.status(200).json({ status: 200, message: 'Deny access' });
            }
        }
    } else {
        return res.status(404).json({ message: 'You don\'t have a request from this ID' });
    }
})

router.delete('/:userEmail', verify, async (req, res) => {
    try {

        const requester = await User.findById(req.user); // Retrieve user by ID from req.user

        // Check if the request comes from a professional
        if (requester.Profession === 'Nutritionist' || requester.Profession === 'Personal Trainer') {
            // Retrieve the professional's ID from the request user
            const professionalId = req.user._id;

            // Retrieve the user's ID to be disenrolled from req.body
            const userEmail = req.params.userEmail;

            // Update the professional's document to remove the user from subscribers
            const updatedProUser = await ProUser.findByIdAndUpdate(
                professionalId,
                { $pull: { subscribersId: userEmail } },
                { new: true }
            );

            // Update the user's document to remove the professional from subscriptions
            const updatedUser = await User.findOneAndUpdate(
                { email: userEmail },
                { $pull: { subscriptionsId: requester.email } },
                { new: true }
            );

            return res.status(200).json({
                status: 200,
                message: 'User disenrolled by Professional',
            });
        } else {
            // If not a professional, proceed with the original function

            const subscriber = await User.findById(req.user._id); // Retrieve user by ID from req.user

            const professionistEmail = req.params.userEmail; // Retrieve professionist ID from req.body

            // Use professionistId to find ProUser
            const professionist = await User.findOne({ email: professionistEmail });

            if (!subscriber) return res.status(400).json({ status: 400, message: 'Subscriber not found' });
            if (!professionist) return res.status(400).json({ status: 400, message: 'Professionist not found' });

            // Check if the user is not subscribed
            if (!subscriber.subscriptionsId || !subscriber.subscriptionsId.includes(professionistEmail)) {
                return res.status(400).json({ status: 400, message: 'User is not subscribed' });
            }

            // Update the user document using the User model
            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                { $pull: { subscriptionsId: professionistEmail } },
                { new: true }
            );

            const updatedProUser = await ProUser.findByIdAndUpdate(
                professionist._id.toHexString(),
                { $pull: { subscribersId: subscriber.email, requestId: subscriber.email } },
                { new: true }
            );

            res.status(200).json({
                status: 200,
                message: 'User unsubscribed from Professionist',
            });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(400).send({ status: 400, message: err.message });
    }
});


// Get subscription or subscriber of the users (14)
router.get('/:emailUser', verify, async (req, res) => {
    reqEmail = await User.findById(req.user._id);
    console.log(reqEmail.email);
    console.log(req.params.emailUser);
    if (reqEmail.email === req.params.emailUser) {
        const user = await User.findById(req.user);

        //Check if the user exists
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        //JSON variable to return to the caller
        const JSON_user = {
            name: user.name,
            email: user.email,
            weight: user.weight,
            height: user.height,
            age: user.age,
            gender: user.gender,
            userType: user.userType,
            Profession: user.Profession,
            timestap: user.timestamp,
            code: user._id,
        };

        // We set the header for returning the JSON variable
        return res.status(200).json({ status: 200, user: JSON_user });
    } else {
        const user = await User.findById(req.user);

        //Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userEmail = req.params.emailUser;

        //Check if we get the subscriptionId in the request parameters
        if (!userEmail) {
            return res.status(404).json({ message: 'Id not found' });
        }


        //Check if we are subscribed to the user
        for (const id of user.subscriptionsId) {
            if (id === userEmail) {
                return await sendUpdateUser(res, userEmail);
            }
        }

        //Check if it is one of our subscriber
        for (const id of user.subscribersId) {
            if (id === userEmail) {
                return await sendUpdateUser(res, userEmail);
            }
        }


        //If we are not subscribed to him/her
        return res.status(404).json({ message: 'You are not subscribed to him/her or your subscription' });
    }

});

// Get all the user's subscription ids (9)
router.get('/', verify, async (req, res) => {
    const user = await User.findById(req.user);

    // Check if the user exists
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    let response = {
        subscriptions: [],
    };

    for (const mail of user.subscriptionsId) {
        const userSub_query = await User.findOne({ email: mail });
        const userSub = userSub_query;

        if (!userSub){
            continue;
        }

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

        response.subscriptions.push(insert_push);
    }

    return res.status(200).json({ status: 200, subscriptions: response });
})


module.exports = router;
