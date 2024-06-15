const mongoose = require('mongoose');
const moment = require('moment-timezone');

const messageSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: function() {
            var time = moment.tz(new Date(), "Europe/Rome");
            return time.format('YYYY/MM/DD HH:mm');
        }
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;