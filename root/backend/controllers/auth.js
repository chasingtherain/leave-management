const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.postLogin = (req,res,next) => {
    const email = req.body.email
    const password = req.body.password
    console.log(req.body)
    User
        .findOne({email: email})
        .then(user => {
            if(!user){
                return res.status(400).send("email is not registered")
            }
            bcrypt
                .compare(password, user.password)
                .then(passwordMatch => {
                    if(passwordMatch){
                        console.log("password match!")
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log("err: ", err)
                            console.log(user)
                            res.status(200).send(
                                {
                                    _id: user._id,
                                    name: user.name,
                                    isAdmin: user.isAdmin,
                                    email: user.email,
                                    password: user.password,
                                    createdOn: user.createdOn,
                                    lastUpdatedOn: user.lastUpdatedOn,
                                    ro: user.ro,
                                    reportingEmail: user.reportingEmail,
                                    co: user.co,
                                    coveringEmail: user.coveringEmail,

                                })
                        })
                    }
                    console.log("password does not match")
                })
                .catch( err =>console.log(err))
        })
}

exports.postLogout = (req,res,next) => {
    console.log("before destroying: ", req.session)
    req.session.destroy((err) => {
        console.log("err: ", err)
    })
    console.log("after destroying: ", req.session)
}