const express = require('express')

const adminController = require('../controllers/admin')

const router = express.Router()

// route is /admin/create-user
router.post('/create-user', adminController.postCreateUser)

// route is /admin/delete-user
router.post('/delete-user', adminController.postDeleteUser)

// route is /admin/create-new-leave
router.post('/create-new-leave', adminController.postCreateLeaveType)

module.exports = router