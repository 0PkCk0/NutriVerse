const mongoose = require('mongoose');
const moment = require('moment-timezone');
const User = require('./UserModel');

const proUserSchema = mongoose.Schema({
    Code: {
        type: String,
        default: function() {
            return Math.floor(100000 + Math.random() * 900000);
        }
    },
    subscriptionStartDate: {
        type: String,
        default: function() {
            var time = moment.tz(new Date(), "Europe/Rome");
            return time.format('YYYY/MM/DD HH:mm');
        }
    },
    subscriptionEndDate: {
        type: String,
        default: function() {
            var time = moment.tz(new Date(), "Europe/Rome");
            return time.format('YYYY/MM/DD HH:mm');
        }
    },
    Profession: {
        type: String,
        required: true,
        enum: ["Personal Trainer", "Nutritionist", "Premium User"]
    },
    subscribersId: {
        type: [String]
    },

    requestId:{
        type: [String]
    }
});

const ProUser = User.discriminator('ProUser', proUserSchema);

module.exports = ProUser;