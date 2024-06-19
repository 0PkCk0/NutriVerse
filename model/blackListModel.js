const mongoose = require("mongoose");

const BlackListSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    }
});

const BlackList = mongoose.model('BlackList', BlackListSchema);

module.exports = BlackList;