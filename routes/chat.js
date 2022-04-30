const route = require('express').Router();
const User = require('../models/user');
const logger = require('../middleware/logger');
const Message = require('../models/message');

route.post('/addmessage', logger, async (req, res) =>{
   const message = await Message.insertMany({
       message: req.body.message,
       recipients: [req.body.from, req.body.to],
       sender: req.body.sender,
       timestamp: JSON.stringify(Date.now())
   })
   res.status(200).json({message: 'message sent!'})
})

route.post('/getmessages', logger, async (req, res) =>{
    const sent = await Message.find({
        recipients: [req.body.from, req.body.to]
    })
    const receive = await Message.find({
        recipients: [req.body.to, req.body.from]
    })
    const unsorted = [...sent, ...receive];
    const sorted = unsorted.sort((a, b) =>{
        return a.timestamp - b.timestamp
    })
    res.status(200).json(sorted)

})

module.exports = route;