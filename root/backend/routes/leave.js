const express = require('express')

const router = express.Router()

router.use('/leave', (req,res)=> {
    res.send("<h1>leave info to be sent by server</h1>")
})

module.exports = router