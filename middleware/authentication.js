const jwt = require('jsonwebtoken');
const User = require('../models/User')

const authentication =  (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if(authHeader?.startsWith('Bearer')) {
        const token = authHeader.split(' ')[1]; // Authorization: Bearer accessToken

        // check token equal to ACCESS_TOKEN_SECRET
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err){
                req.user = {}
                return next()
            }
            
            const foundUser = await User.findById(decoded.id).select({ password: 0, refresh_token: 0 }).exec() 
            //select({}) for choose which field we not want to query from database in this case is password and refresh_token cause security
            if(foundUser) {
                console.log("case 1")
                req.user = foundUser.toObject({ getters: true }) // convert foundUser to plain javascript object and can be use virtual data in Schema
            }else {
                console.log("case 2")
                req.user = {}
            }

            return next();
        })
    }else {
        console.log("case 3")
        req.user = {}
        return next()
    }
}

module.exports = authentication