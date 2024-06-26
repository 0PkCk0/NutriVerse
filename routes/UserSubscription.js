const router = require('express').Router();
const User = require('../model/UserModel');
const ProUser = require('../model/ProUserModel');
const verify = require('../config/verifyToken');
const { sendUpdateUser } = require('../config/updateUser');

router.post('/', verify, async (req, res) => {
    try {
        const subscriber = await User.findById(req.user._id);

        if (!subscriber) {
            return res.status(400).send({ message: 'Subscriber not found' });
        }

        const professionistEmail = req.body.email;

        const query = await ProUser.findOne({ email: professionistEmail });
        const professionist = query;

        if (!professionist) {
            return res.status(400).send({ message: 'Professionist not found' });
        }

        // Check if professionist is a premium user (not allowed)
        if (professionist.Profession === 'Premium User') {
            return res.status(400).send({ message: 'Professionist is a Premium user' });
        }

        if ((subscriber.subscriptionsId && subscriber.subscriptionsId.includes(professionistEmail)) ||
            (professionist.requestId && professionist.requestId.includes(req.user.email))) {
            return res.status(400).send({ message: 'Subscription already exists or request pending' });
        }

        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { subscriptionsId: professionistEmail } },
            { new: true }
        );

        await ProUser.findByIdAndUpdate(
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

router.put('/', verify, async (req, res) => {
    const user = await User.findById(req.user);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (user.Profession !== 'Nutritionist' && user.Profession !== 'Personal Trainer') {
        return res.status(400).json({ message: 'User is not a professionist' });
    }

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
                        return res.status(200).json({ message: 'Error adding' });
                    });
            } else {
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
});

router.delete('/:userEmail', verify, async (req, res) => {
    try {
        const requester = await User.findById(req.user); // Retrieve user by ID from req.user

        // Check if the request comes from a professional
        if (requester.Profession === 'Nutritionist' || requester.Profession === 'Personal Trainer') {
            // Retrieve the professional's ID from the request user
            const professionalId = req.user._id;

            // Retrieve the user's ID to be disenrolled from req.params
            const userEmail = req.params.userEmail;

            // Update the professional's document to remove the user from subscribers
            await ProUser.findByIdAndUpdate(
                professionalId,
                { $pull: { subscribersId: userEmail } },
                { new: true }
            );

            // Update the user's document to remove the professional from subscriptions
            await User.findOneAndUpdate(
                { email: userEmail },
                { $pull: { subscriptionsId: requester.email } }, { new: true },
            );

            return res.status(200).json({
                status: 200,
                message: 'User disenrolled by Professional',
            });
        } else {
            const subscriber = await User.findById(req.user._id); // Retrieve user by ID from req.user

            const professionistEmail = req.params.userEmail; // Retrieve professionist ID from req.params

            // Use professionistId to find ProUser
            const professionist = await User.findOne({ email: professionistEmail });

            if (!subscriber || !professionist) return res.status(400).json({ status: 400, message: 'Subscriber or Professionist not found' });

            // Check if the user is not subscribed
            if (!subscriber.subscriptionsId || !subscriber.subscriptionsId.includes(professionistEmail)) {
                return res.status(400).json({ status: 400, message: 'User is not subscribed' });
            }

            // Update the user document using the User model
            await User.findByIdAndUpdate(
                req.user._id,
                { $pull: { subscriptionsId: professionistEmail } },
                { new: true }
            );

            await ProUser.findByIdAndUpdate(
                professionist._id.toHexString(),
                { $pull: { subscribersId: subscriber.email } },
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

router.get('/:emailUser', verify, async (req, res) => {
    const reqEmail = await User.findById(req.user._id);
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
            timestamp: user.timestamp,
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
            insert_push.profession = 'N';
        } else if (userSub.Profession === 'Personal Trainer') {
            insert_push.profession = 'P';
        } else {
            insert_push.profession = 'B';
        }

        // Index for selecting the user image in the main dashboard
        insert_push.index = 1;
        insert_push.code = userSub.Code;

        response.subscriptions.push(insert_push);
    }

    return res.status(200).json({ status: 200, subscriptions: response });
})

module.exports = router;