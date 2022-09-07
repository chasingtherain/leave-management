const express = require('express')
const colors = require('colors')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const MONGODB_URI = 'mongodb+srv://mfachengdu:iamsingaporean@cluster0.rbiadah.mongodb.net/leave-management?retryWrites=true&w=majority'

require('dotenv').config()

const app = express()
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
})




const adminRoutes = require('./routes/admin')
const leaveRoutes = require('./routes/leave')
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const { collection } = require('./models/user')

app.use(cors())
app.use(
    session({secret: "secret94", resave: false, saveUninitialized: false, store: store}))
app.use(express.urlencoded({extended: true})) //Parse URL-encoded bodies
app.use(express.json())

app.use('/admin',adminRoutes)
app.use('/leave',leaveRoutes)
app.use('/user',userRoutes)
app.use(authRoutes)
    
app.get('/', (req,res)=> {
    res.send("<h1>homepage</h1>")
})

mongoose
    .connect(MONGODB_URI)
    .then(client => {
        console.log("MongoDB connection via mongoose successful".green)
        app.listen(8008)
    })
    .catch(err => {
        console.log(err)
        console.log("failed to connect MongoDB".red)
    })

