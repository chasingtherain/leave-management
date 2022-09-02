const express = require('express')
const path = require('path')
const app = express()
const mongoose = require('mongoose')

const mongoConnect = require('./util/database')

const rootDir = require('../backend/util/path')


const adminRoutes = require('./routes/admin')
const leaveRoutes = require('./routes/leave')
const userRoutes = require('./routes/user')

app.use(express.urlencoded({extended: true})) //Parse URL-encoded bodies

app.use('/admin',adminRoutes)
app.use('/leave',leaveRoutes)
app.use('/user',userRoutes)
    
app.get('/', (req,res)=> {
    res.send("<h1>homepage</h1>")
})
app.use('/*', (req,res) => {
    res.status(404).sendFile(path.join(rootDir, 'views', 'PageNotFound.html'))
})

mongoose
    .connect('mongodb+srv://mfachengdu:iamsingaporean@cluster0.rbiadah.mongodb.net/?retryWrites=true&w=majority')
    .then(client => {
        console.log("MongoDB connection via mongoose successful".green)
        app.listen(8008)
    })
    .catch(err => {
        console.log(err)
        console.log("failed to conenct MongoDB".red)
    })
// mongoConnect((client) => {
//     console.log(client)
// })

// app.listen(8008)

