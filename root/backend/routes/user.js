const express = require('express')

const router = express.Router()

const userController = require('../controllers/user')

router.use('/login', (req,res)=> {
    res.send("<h1>server doing auth check</h1>")
})

router.use('/get_userinfo:id', (req,res)=> {
    res.send("<h1>specific user info sent back by server</h1>")
})

router.get('/getAllUsers', userController.getAllUser)

// router.use('/update_userinfo', )

router.use('/delete', (req,res)=> {
    res.send("<h1>user deleted by server</h1>")
})

module.exports = router