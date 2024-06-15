const express = require('express');
const router = express.Router();
const User = require('../model/UserModel');
const verify = require('../config/verifyToken');
const Message = require('../model/MessageModel');

router.post('/', verify, async (req, res) => {
    const { message, receiver } = req.body; // renamed Message to messageContent and Receiver to receiver
    const sender = req.user._id; 

    try {
        const newMessage = new Message({ 
            message: message,
            sender: sender, 
            receiver: receiver
        });

        const savedMessage = await newMessage.save();

        res.status(200).json(savedMessage);
    } catch (error) {
        console.error('Error creating message', error);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
});

router.get('/', verify, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { receiver: req.user._id },
                { sender: req.user._id }
            ]
        }).select('message -_id');
    
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error getting messages', error);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
});

module.exports = router;
