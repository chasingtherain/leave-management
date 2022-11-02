const express = require('express')
const colors = require('colors')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const multer = require('multer')
const helmet = require('helmet')
const compression = require('compression')
const cronJob = require('../backend/cronjob')

require('dotenv').config()

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@cluster0.rbiadah.mongodb.net/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`

const app = express()
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
})

const adminRoutes = require('./routes/admin')
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const { collection } = require('./models/user')

app.use(cors())
app.options('*', cors())
app.use(helmet())
app.use(compression())
app.use(multer().single('upload'))
app.use(
    session({secret: "secret94", resave: false, saveUninitialized: false, store: store, cookie: { maxAge: 86400 }}))
app.use(express.urlencoded({extended: true})) //Parse URL-encoded bodies
app.use(express.json())

app.use('/admin',adminRoutes)
app.use('/user',userRoutes)
app.use(authRoutes)
    
mongoose
    .connect(MONGODB_URI)
    .then(client => {
        const server = app.listen(process.env.PORT || 8008)
        const io = require('./socket').init(server)

        console.log("MongoDB connection via mongoose successful".green)
        console.log(`Server started on ${process.env.PORT}`.green)
        cronJob.runCronJob()

        io.on('connection', socket => {
            console.log("client connected")
        })

    })
    .catch(err => {
        console.log(err)
        console.log("failed to connect MongoDB".red)
    })

