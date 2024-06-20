const mongoose = require('mongoose');
const moment = require('moment-timezone');

const messageSchema = mongoose.Schema({
    clientA: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    clientB: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    messages: [new mongoose.Schema({
        sender: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 255
        },
        text: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 1024,
        },
        date: {
            type: String,
            default: function () {
                var time = moment.tz(new Date(), "Europe/Rome");
                return time.format('YYYY/MM/DD HH:mm');
            }
        }
    }, {
        _id: false // Opzione per evitare di creare un _id per ogni elemento in messages
    })],
});


const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
