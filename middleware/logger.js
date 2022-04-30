require('dotenv').config();
const jwt = require('jsonwebtoken');
const logger = (req, res, next) =>{
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY, (err, decoded) =>{
        if(decoded.userId !== req.body.userId){
            return res.status(401).json({
                message: 'authentication failed'
            })
        }else{
            next();
        }
        
    })
}

module.exports = logger;