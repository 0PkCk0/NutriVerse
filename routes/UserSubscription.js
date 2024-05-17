const router = require('express').Router();
const User = require('../model/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');


router.get('/', verify, async (req, res) => {
    const user = await User.findById(req.user);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const JSON_user= {
        subscriptions:user.subscriptionsId,
    };

    res.setHeader('Content-Type', 'application/json');
    res.json(JSON_user);
})


module.exports = router;
