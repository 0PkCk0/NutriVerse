const jwt = require('jsonwebtoken');
const Message = require('../model/MessageModel');

module.exports = function verifyToken(req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send({ message: 'Invalid token'});
    }
}