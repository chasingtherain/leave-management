const User = require('../models/user')

exports.postLogin = (req,res,next) => {
    User
        .findById('6312ce766fd1f8454eed6156')
        .then(user => {
            req.session.user = user
            req.session.isLoggedIn = true
            res.redirect('http://localhost:3000/')
            console.log(req.session)
        })
        .catch(err => console.log(err))
}

exports.postLogout = (req,res,next) => {
    console.log("before destroying: ", req.session)
    req.session.destroy((err) => {
        console.log("err: ", err)
    })
    console.log("after destroying: ", req.session)
}