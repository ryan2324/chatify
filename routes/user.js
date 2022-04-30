require('dotenv').config();
const User = require('../models/user');
const route = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const logger = require('../middleware/logger');

route.post('/signup', (req, res) =>{
    bcrypt.hash(req.body.password, 10, (err, hash) =>{
        const user = User.insertMany({
            fullName: req.body.fullName,
            username: req.body.username,
            password: hash
        })
    })
    res.status(200).json({
        message: 'signup success'
    })
})


route.post('/login', async (req, res) =>{
    
    const user = await User.findOne({username: req.body.username});
    if(!user){
        return res.status(404).json({
                message: 'Not Found'
                })
    }
    res.json(user);
    // bcrypt.compare(req.body.password, user.password, (err, result) =>{
    //     if(result){
            
    //         const token = jwt.sign({
    //             userId: user._id,
    //         }, '123')
    //         res.cookie('chatifyToken', token)
    //         res.status(200).json({
    //             userId: user._id,
    //             username: user.username,
    //             token: token
    //         })
            
    //     }else{
    //         console.log('user cannot found')
    //     }
    // })
    
})
route.post('/search', logger, async (req, res) =>{
    const query = new RegExp(`^${req.body.fullName}`)
    const result = await User.find({fullName: {$regex: query}})
    let people = [];

    const filtered = result.filter((person) =>{
        return person._id.toString() !== req.body.userId
    })
    filtered.forEach(person => {
        people.push({
            room: person._id,
            fullName: person.fullName
        })
    });
    res.status(200).json(people)
})
route.post('/get-contact', async (req, res) =>{
    const contact = await User.findOne({_id: req.body.id})
    if(contact){
        res.status(200).json({
            id: contact._id,
            username: contact.username,
            lastMessage: contact.lastMessage
        })
    }
})



module.exports = route;