const User = require('./UserModel');

const mongoose = require('mongoose');

const premiumUserSchema = new mongoose.Schema({
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
    }
});

module.exports = User.discriminator('PremiumUser', premiumUserSchema);

