require('dotenv').config();
const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
const logger = require('./middleware/logger');
const chatRoute = require('./routes/chat');
const recentMessageRoute = require('./routes/recentMessage');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {Server} = require('socket.io')
const app = express();
const PORT = 3000;
const server = app.listen(PORT, () =>{
    console.log(`lisntening on port`, PORT)
})


const io = new Server(server);
io.on('connection', (socket) =>{
    socket.emit('id', socket.id)
    
    socket.on('send', (data) =>{
        socket.to(data.room).emit('receive', data)
    })
    socket.on('initialRoom', (data) =>{
        socket.join(data)
    })
})
const uri = `mongodb+srv://chatify:${process.env.DATABASE_PASSWORD}@cluster0.tdab9.mongodb.net/usersDatabase?retryWrites=true&w=majority`
mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
app.use(cookieParser());
app.use(express.json())
app.use('/public', express.static('public'))
app.get('/', (req, res) =>{
    try{
        const decoded = jwt.verify(req.cookies.chatifyToken, process.env.JWT_KEY)
        if(decoded){
            res.sendFile(path.resolve(__dirname, './views/index.html'))
        }else{
            res.sendFile(path.resolve(__dirname, './views/login-page.html'))
        }  
    }catch(error){
        res.sendFile(path.resolve(__dirname, './views/login-page.html'))
    }
    
})
app.get('/signup', (req, res) =>{
    res.sendFile(path.resolve(__dirname, './views/signup-page.html'))
})
app.get('/login', (req, res) =>{
    res.sendFile(path.resolve(__dirname, './views/login-page.html'))
})
app.use('/user', userRoute);
app.use('/message', chatRoute)
app.use(recentMessageRoute);
