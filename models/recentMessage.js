const mongoose = require('mongoose');

const recentMessage = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    personId:{
        type: String,
        required: true
    },
    personFullName:{
        type: String,
        required: true,
    },
    lastMessage: {
        type: String,
        required: true
    },
    opened:{
        type: Boolean,
        required: true
    },
    timestamp: {
        type: String
    }
})

module.exports = mongoose.model('recentMessage', recentMessage)