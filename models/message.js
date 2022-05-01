const mongoose = require('mongoose');

const message = new mongoose.Schema({
    message:{
        type: String,
        required: true
    },
    sender:{
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    receiver:{
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    timestamp:{
        type: String
    } 
});

module.exports = mongoose.model('message', message);