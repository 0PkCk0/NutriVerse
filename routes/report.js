const express = require('express');
const router = express.Router();
const User = require('../model/UserModel');
const verify = require('../config/verifyToken');
const transporter = require('../config/transporter');

router.post('/', verify, async (req, res) => {
    const {text} = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(400).json({ status: 400, message: 'User not found' });
        const email = user.email;

        let mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: process.env.EMAIL_USERNAME,
            subject: 'Report from user ' + email ,
            text: text
        };

        transporter.sendMail(mailOptions, function(err) {
            if (err) {
                console.error('Error sending email: ', err);
                return res.status(500).json({ status: 500, message: 'Technical Issue!, Please click on resend for verify your email.' });
            }
            res.status(200).json({ status: 200, message: 'A report email has been sent' });
        });

        res.send({ status: 200, message: 'Report sent successfully' });
    } catch (error) {
        console.error('Errors sending the report', error);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
})

module.exports = router;