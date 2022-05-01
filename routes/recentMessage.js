const route = require('express').Router();
const RecentMessage = require('../models/recentMessage');
route.post('/recent-message', async (req, res) =>{
    const response = await RecentMessage.find({
        userId: req.body.userId,
    })

    const sorted = response.sort((a, b) =>{
        return b.timestamp - a.timestamp 
    })
    
    res.status(200).json(sorted)
})

route.post('/add-recent-message', async (req, res) =>{
    const recent = await RecentMessage.insertMany({
        userId: req.body.userId,
        personId: req.body.personId,
        personFullName: req.body.personFullName,
        lastMessage: req.body.lastMessage,
        opened: req.body.opened,
        timestamp: JSON.stringify(Date.now())
    })
    res.status(200).json({message: 'recent message added'})
})

route.patch('/update-last-message', async (req, res) =>{
    const recent = await RecentMessage.updateMany({
        userId: req.body.userId, 
        personId: req.body.personId }, 
        {$set:{lastMessage: req.body.lastMessage, opened: req.body.opened, timestamp: JSON.stringify(Date.now())}})
    console.log(req.body)
    res.status(200).json({message: 'update success'})
})

module.exports = route;