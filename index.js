// server
// require dotenv for working with .env
require('dotenv').config()

const express = require('express')
const path = require('path')
const cors = require('cors') // for set cors
const corsOptions = require('./config/cors') 
const credentials = require('./middleware/credential')
const errorhandler = require('./middleware/error_handler')
const authentication = require('./middleware/authentication')
const cookieParser = require('cookie-parser') // for work with cookie
const mongoose = require('mongoose') // for work with database
const connectDB = require('./config/database')

const app = express()
const PORT = process.env.PORT || 3600;

connectDB() // connect database

app.use(credentials)
app.use(cors(corsOptions))
app.use(authentication)
// middleware 
// built in basic 
app.use(express.urlencoded({ extended: false })) // application.x-www-form-urlencoded
app.use(express.json()) // application json response
app.use(cookieParser()) // middleware for cookie
app.use(express.static(path.join(__dirname, "/public"))) //static file: css, img, font

// Routes 
app.use('/api/auth', require('./routes/api/auth'))
// default handler routes
app.all('./*', (req, res) => {
    res.sendStatus(404).json({ 'message': 'routes not found'})
})
// default errorHandler
app.use(errorhandler)

mongoose.connection.once('open', () => {
    console.log('MongoDB Database Connected ')
    app.listen(PORT, () => {
        console.log(`server is running on PORT ${PORT}`)
    })
})
