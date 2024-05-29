const mongoose = require('mongoose');
const moment = require('moment-timezone');
const { id } = require('@hapi/joi/lib/base');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 6,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    weight: [{
        value: {
            type: Number,
            min: 30,
        },
        date: {
            type: String,
            default: function() {
                var time = moment.tz(new Date(), "Europe/Rome");
                return time.format('YYYY/MM/DD HH:mm');
            }
        }
    }],
    height: {
        type: Number,
        min: 0
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Unspecified"]
    },
    timestamp: {
        type: String,
        default: function() {
            var time = moment.tz(new Date(), "Europe/Rome");
            return time.format('YYYY/MM/DD HH:mm');
        }
    },
    subscriptionsId: [{
        type : String
    }],
    confirmed: {
        type: Boolean,
        default: false
    },
},{
    discriminatorKey: 'userType', // Key to differentiate between different user types
    collection: 'users' // Store all user types in the same collection
});

const User = mongoose.model('User', userSchema);

module.exports = User;

    

