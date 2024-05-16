const User = require('./UserModel');
const mongoose = require('mongoose');

const proUserSchema = new mongoose.Schema({
    subscriptionStartDate: {
        type: Date,
        default: function() {
            var time = moment.tz(new Date(), "Europe/Rome");
            return time.format('YYYY/MM/DD HH:mm');
        }
    },
    subscriptionEndDate: {
        type: Date,
        default: function() {
            var time = moment.tz(new Date(), "Europe/Rome");
            time.add(1, 'years');
            return time.format('YYYY/MM/DD HH:mm');
        }
    },
    Profession: {
        type: String,
        required: true,
        enum: ["Personal Trainer", "Nutritionist", "Premium User"]
    }
});

module.exports = User.discriminator('ProUser', proUserSchema);