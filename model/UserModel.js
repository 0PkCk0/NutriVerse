const mongoose = require('mongoose');
const moment = require('moment-timezone');
const { id } = require('@hapi/joi/lib/base');
const { type } = require('@hapi/joi/lib/extend');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 6,
        maxlength: 255
    },
    surname: {
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
            default: function () {
                var time = moment.tz(new Date(), "Europe/Rome");
                return time.format('YYYY/MM/DD HH:mm');
            }
        }
    }, {
        _id: false 
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
        default: function () {
            var time = moment.tz(new Date(), "Europe/Rome");
            return time.format('YYYY/MM/DD HH:mm');
        }
    },
    subscriptionsId: [{
        type: String
    }],
    confirmed: {
        type: Boolean,
        default: false
    },
    plansUrl: [{
        professionalId: {
            type: String
        },
        url: { 
            type: String 
        },
        type: {
            type: String,
            enum: ["Diet", "Workout"]
        },
    }, {
        _id: false 
    }
    ]
}, {
    discriminatorKey: 'userType', // Key to differentiate between different user types
    collection: 'users' // Store all user types in the same collection
});

const User = mongoose.model('User', userSchema);

module.exports = User;



