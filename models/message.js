const mongoose = require('mongoose');

const message = new mongoose.Schema({
    message:{
        type: String,
        required: true
    },
    recipients: {
        type: Array
    },
    sender:{
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    timestamp:{
        type: String
    } 
});

module.exports = mongoose.model('message', message);