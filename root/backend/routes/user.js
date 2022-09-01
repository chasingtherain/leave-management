const express = require('express')

const router = express.Router()

router.use('/login', (req,res)=> {
    res.send("<h1>server doing auth check</h1>")
})

router.use('/get_userinfo:id', (req,res)=> {
    res.send("<h1>specific user info sent back by server</h1>")
})

router.use('/get_userinfo', (req,res)=> {
    res.send("<h1>all user info sent back by server</h1>")
})

router.use('/update_userinfo', (req,res)=> {
    res.send("<h1>user info updated by server</h1>")
})

router.use('/delete', (req,res)=> {
    res.send("<h1>user deleted by server</h1>")
})

module.exports = router