// use credential if client work with cookie
const allowedOrigin = require('../config/allowedOrigin')

const credentials = (req, res, next) => {
    // console.log('request.headers: ', req.headers)
    const origin = req.headers.origin
    // check header of request is in allowedOrigin that we set 
    if(allowedOrigin.includes(origin)) {
        res.header('Access-Control-Allow-Origin', true) //if req.headers.origin is in allowedOrigin +> can be access
        res.header('Access-Control-Allow-Credentials', true) // allow clients
    }

    next() // let do next middleware we have
}

module.exports = credentials