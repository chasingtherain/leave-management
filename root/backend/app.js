const express = require('express')
const path = require('path')
const app = express()

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
    res.status(404).sendFile(path.join(__dirname, 'views', 'PageNotFound.html'))
})

app.listen(8008)

