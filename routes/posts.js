const router = require('express').Router();
const User = require('../model/UserModel');
const verify = require('./verifyToken');

router.get('/', verify,(req, res) => {
    const userID = req.user;
    res.send(userID);
})

module.exports = router;