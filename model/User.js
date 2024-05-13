const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    weight: {
        type: Number,
        required: false,
        min: 0
    },
    height: {
        type: Number,
        required: false,
        min: 0
    },
    age: {
        type: Number,
        required: false,
        min: 18
    },
    gender: {
        type: String,
        required: false,
        enum: ["Male", "Female", "Unspecified"]
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);