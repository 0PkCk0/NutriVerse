const router = require('express').Router();
const User = require('../model/User');
const verify = require('./verifyToken');

router.get('/', verify,(req, res) => {
    res.send(req.user); // USO USER PERCHE IN AUTH SEMPLICEMENTE HO MESSO NEL TOKEN SOLO L'ID
})

module.exports = router;