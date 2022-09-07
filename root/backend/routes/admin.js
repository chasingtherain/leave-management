const express = require('express')

const adminController = require('../controllers/admin')

const router = express.Router()

// route is /admin/create-user
router.post('/create-user', adminController.postCreateUser)

module.exports = router