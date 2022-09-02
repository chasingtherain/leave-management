const express = require('express')

const adminController = require('../controllers/admin')

const router = express.Router()

const rootDir = require('../util/path')



router.get('/create-user', (req,res)=> {
    res.send(
        `<form action=/admin/posting-new-user method=POST>
        <input type="text" name="name">
        <button type="submit">Add user</button>
        </form>`)
    })

// route is /admin/create-user
router.post('/create-user', adminController.postCreateUser)

module.exports = router