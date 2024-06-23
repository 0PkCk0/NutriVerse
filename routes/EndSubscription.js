const ProUser = require('../model/ProUserModel');
const moment = require('moment-timezone');
const express = require('express');
const app = express();
const verify = require("../config/verifyToken");

app.get('/', verify, async (req, res) => {

    const prouser = await ProUser.findById(req.user);

    if (!prouser) {
        return res.status(400).json({ status: 400, message: 'ProUser not found' });
    }

    // Assuming prouser.subscriptionEndDate is a string in 'YYYY/MM/DD HH:mm' format
    const date1 = moment.tz("Europe/Rome");
    const date2 = moment.tz(prouser.subscriptionEndDate, "YYYY/MM/DD HH:mm", "Europe/Rome");

    // Now you can compare date1 and date2
    const isSubscriptionEnded = date1.isAfter(date2);

    console.log(isSubscriptionEnded); // true if the subscription has ended, false otherwise

    const formattedDate2 = date2.format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');

    const isDate1AfterDate2 = date1.isAfter(formattedDate2);

    if (isDate1AfterDate2) {
        return res.status(200).json({ status: 200, message: 'Subscription ended' });
    } else {
        return res.status(400).json({ status: 400, message: 'Subscription not ended' });
    }
});

module.exports = app;