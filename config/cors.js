const allowedOrigin = require('./allowedOrigin')

const corsOptions = {
    origin: (origin, callback) => {
        if(allowedOrigin.includes(origin) || !origin) {
            // console.log("origin: ", origin)
            callback(null, true)
        }else {
            callback(new Error('Not allows by CORS'))
        }
    }
}

module.exports = corsOptions