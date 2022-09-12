const express = require('express')

const router = express.Router()

const userController = require('../controllers/user')

router.get('/getUser/:id', userController.getUser)

router.get('/getAllUsers', userController.getAllUsers)

router.post('/numOfDays', userController.getNumOfDaysApplied)

router.post('/applyLeave', userController.postLeaveApplicationForm)

// router.use('/update_userinfo', )

router.use('/delete', (req,res)=> {
    res.send("<h1>user deleted by server</h1>")
})

module.exports = router