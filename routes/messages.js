const express = require('express');
const router = express.Router();
const User = require('../model/UserModel');
const verify = require('../config/verifyToken');
const Message = require('../model/MessageModel');

router.post('/', verify, async (req, res) => {
    const user = await User.findById(req.user);

    if (!user){
        return res.status(400).json({ status: 400, message: 'User not found' });
    }

    const receiver = req.body.receiver;

    const message=req.body.message;

    let [first, second] = [user.email, receiver].sort((a, b) => a.localeCompare(b));

    try {
        mes=await Message.findOne({clientA:first, clientB:second});


        if (mes){
            const newMessage={
                sender:user.email,
                text:message,
            }

            mes.messages.push(newMessage);

            await mes.save();
            res.status(200).json({status:200,message:"sent"});
        }else{
            const newChat=new Message({
                clientA:first,
                clientB:second,
                messages:[
                    {
                        sender:user.email,
                        text:message,
                    }
                ]
            });

            await newChat.save();
            res.status(200).json({status:200,message:"sent"});
        }
    } catch (error) {
        console.error('Error creating message', error);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
});

router.get('/:UserEmail', verify, async (req, res) => {
    const user = await User.findById(req.user);

    if (!user){
        return res.status(400).json({ status: 400, message: 'User not found' });
    }

    otherUser=req.params.UserEmail;

    let [first, second] = [user.email, otherUser].sort((a, b) => a.localeCompare(b));

    try {
        mes=await Message.findOne({clientA:first, clientB:second});

        if (mes){

            return res.status(200).json({status:200,messages:mes.messages});

        }else{

            return res.status(200).json({status:200,messages:[]});

        }
    } catch (error) {
        console.error('Error getting messages', error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
});

module.exports = router;
