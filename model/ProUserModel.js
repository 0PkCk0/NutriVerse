const User = require('./UserModel');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const proUserSchema = mongoose.Schema({
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
    }
});

const ProUser = User.discriminator('ProUser', proUserSchema);

module.exports = ProUser;