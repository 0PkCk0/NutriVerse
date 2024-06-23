const ProUser = require('../model/ProUserModel');
const moment = require('moment-timezone');
const express = require('express');
const app = express();
const verify = require("../config/verifyToken");

app.get('/', verify, async (req, res) => {

    const prouser = await ProUser.findById(req.user);
    const date = moment.tz("Europe/Rome").format("YYYY-MM-DD HH:mm");
    const date2 = moment.tz(prouser, "YYYY-MM-DD HH:mm", "Europe/Rome");

    const isDate1AfterDate2 = date.isAfter(date2);

    if (isDate1AfterDate2) {
        return res.status(200).json({ status: 200, message: 'Subscription ended' });
    } else {
        return res.status(400).json({ status: 400, message: 'Subscription not ended' });
    }
});

module.exports = app;