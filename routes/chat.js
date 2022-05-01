const route = require('express').Router();
const User = require('../models/user');
const logger = require('../middleware/logger');
const Message = require('../models/message');

route.post('/addmessage', logger, async (req, res) =>{
   const message = await Message.insertMany({
       message: req.body.message,
    //    recipients: [req.body.from, req.body.to],
       sender: req.body.sender,
       receiver: req.body.receiver,
       timestamp: JSON.stringify(Date.now())
   })
   res.status(200).json({message: 'message sent!'})
})

route.post('/getmessages', logger, async (req, res) =>{
    const sent = await Message.find({
        sender: req.body.sender,
        receive: req.body.receiver
    })
    const receive = await Message.find({
        sender: req.body.receiver,
        receive: req.body.sender
    })
    const unsorted = [...sent, ...receive];
    const sorted = unsorted.sort((a, b) =>{
        return a.timestamp - b.timestamp
    })
    res.status(200).json(sorted)
})


module.exports = route;