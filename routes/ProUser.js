const ProUser = require('../model/ProUserModel');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const router = require('express').Router();

router.post('/',verify, async (req, res) => {
    const proUser = new ProUser({
        subscriptionStartDate: req.body.subscriptionStartDate,
        subscriptionEndDate: req.body.subscriptionEndDate,
        Profession: req.body.Profession
    })

    const basic_user = User.findOne({ _id: req.user });

    if (!basic_user) return res.status(400).send('User not found');

    

    const new_proUser = proUser.save()

    if (!new_premiumUser) return res.status(400).send('Error creating premium user');

    try {
        const token = jwt.sign({ _id: premiumUser._id }, process.env.TOKEN_SECRET);
        res.status(201).header('auth-token', token).send(token);
    } catch (err) {
        res.status(400).send(err)
    }

})

module.exports = router;