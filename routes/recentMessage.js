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
    const recent = await RecentMessage.insertMany([{
        userId: req.body.userId,
        personId: req.body.personId,
        personFullName: req.body.personFullName,
        lastMessage: req.body.lastMessage,
        opened: req.body.opened,
        timestamp: JSON.stringify(Date.now())
    },{
        userId: req.body.personId,
        personId: req.body.userId,
        personFullName: req.body.personFullName,
        lastMessage: req.body.lastMessage,
        opened: false,
        timestamp: JSON.stringify(Date.now())
    }])

    res.status(200).json({message: 'recent message added'})
})

route.patch('/update-last-message', async (req, res) =>{
    const sender = await RecentMessage.updateMany({
        userId: req.body.userId, 
        personId: req.body.personId }, 
        {$set:{lastMessage: req.body.lastMessage, opened: req.body.opened, timestamp: JSON.stringify(Date.now())}})

    const receiver = await RecentMessage.updateMany({
        userId: req.body.personId, 
        personId:  req.body.userId}, 
        {$set:{lastMessage: req.body.lastMessage, opened: false, timestamp: JSON.stringify(Date.now())}})
        
    res.status(200).json({message: 'update success'})
})

module.exports = route;