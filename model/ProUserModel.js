const User = require('./UserModel');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const { Code } = require('mongodb');

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
    }
});

async function generateUniqueCode() {
    let code;
    let unique = false;

    while (!unique) {
        code = Math.floor(100000 + Math.random() * 900000).toString();
        const existingUser = await mongoose.models["ProUser"].findOne({Code: code});
        if (!existingUser) {
            unique = true;
        }
    }

    return code;
}

const ProUser = mongoose.model('ProUser', proUserSchema);

module.exports = ProUser;