const express = require('express')

const router = express.Router()

router.get('/add-user', (req,res)=> {
    res.send(
        `<form action=/admin/posting-new-user method=POST>
        <input type="text" name="name">
        <button type="submit">Add user</button>
        </form>`)
    })

router.post('/posting-new-user', (req,res)=> {
    console.log(req.body)
    res.redirect('/')
    // res.send("<h1>user info to be sent by server</h1>")
})

module.exports = router