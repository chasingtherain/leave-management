const User = require('../models/user')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const sendgridMail = require('@sendgrid/mail')

// generate jwt token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '7d'})
}

exports.postLogin = (req,res,next) => {
    const email = req.body.email
    const password = req.body.password
    User
        .findOne({email: email})
        .then(user => {
            if(!user){
                return res.status(400).send("login: email is not registered") 
            }
            bcrypt
                .compare(password, user.password)
                .then(passwordMatch => {
                    if(passwordMatch){
                        console.log("password match!")
                        req.session.isLoggedIn = true;
                        req.session.user = user;

                        return req.session.save(err => {
                            // console.log(user)
                            const sessionTokenByServer = generateToken(user._id)
                            console.log(sessionTokenByServer)
                            User.findOneAndUpdate( // upon login, update token value on server 
                                {email: user.email},
                                {$set: {"sessionToken": sessionTokenByServer }}
                                )
                                .then(result => {
                                    // console.log(result.sessionToken)
                                    return res.status(200).send(
                                        {
                                            _id: user._id,
                                            name: user.name,
                                            isAdmin: user.isAdmin,
                                            email: user.email,
                                            createdOn: user.createdOn,
                                            lastUpdatedOn: user.lastUpdatedOn,
                                            reportingEmail: user.reportingEmail,
                                            coveringEmail: user.coveringEmail,
                                            leave: user.leave,
                                            leaveHistory: user.leaveHistory,
                                            staffLeave: user.staffLeave,
                                            sessionToken: sessionTokenByServer
                                        })
                                })
                            .catch(err => console.log("session err: ", err))

                        })
                    }
                    return res.status(401).send("password does not match")
                    console.log("password does not match")
                })
                .catch( err => {
                    console.log(err)
                    return res.status(400).send("email is not registered")
                })
        })
}

exports.postLogout = (req,res,next) => {
    // console.log("before destroying: ", req.session)
    if(req.session){
        req.session.destroy((err) => {
            if (err) throw err
            req.session = null
            return res.status(200).send("sign out successful")
        })
        // console.log("after destroying: ", req.session)
    }
}

exports.postValidateSession = (req,res,next) => {
    console.log("req.body: ", req.body)
    const sessionId = req.body.sessionId
    User
        .findOne({sessionToken: sessionId})
        .then(user => {
            if(!user){
                return res.status(400).send("invalid token!")
            }
            return res.send(user)
        })
        .catch(err => console.log(err))
}

exports.postChangePassword = (req,res,next) => {
    const email = req.body.email

    crypto.randomBytes(32, (err,buffer) => {
        if(err){
            console.log(err)
        }
        const token = buffer.toString('hex')
    User
        .findOne({email: email})
        .then(user => {
            if(!user){
                return res.status(400).send("email is not registered!")
            }
            user.resetToken = token
            user.resetTokenExpiration = Date.now() + 1800000 // 30 min validity
            return user.save()
        })
        .then(result => {
            sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = {
            to: email, // Change to your recipient
            from: 'mfachengdu@gmail.com', // Change to your verified sender
            subject: 'Password Reset',
            html: `
                <div>
                    <p>You requested to reset your password. </p> 
                    <p> Click this <a href="${process.env.FRONTENDURL}/set-new-password/${token}"> link </a> to set a new password </p>
                </div>
                <div>
                    <p>您要求重设密码。</p> 
                    <p>点击<a href="${process.env.FRONTENDURL}/set-new-password/${token}"> 此链接 </a>设置新密码</p>
                </div>
            `
            }
            sendgridMail
                .send(msg)
                .then(() => {
                    return res.status(200).send("reset password email sent")
                    console.log('Email sent')
                })
                .catch((error) => {
                    console.error("sendgrid error: ", error)
                })
            
        })
        .catch(err => console.log(err))
    })
}

exports.postUpdatePassword = (req,res,next) => {
    const userToken = req.body.userToken
    const updatedPassword = req.body.password
    let currentUser;
    User.findOne({resetToken: userToken, resetTokenExpiration: {$gt: Date.now()}})
        .then((user) => {
            if(!user){
                throw new Error("update password: user not found") 
            }
            currentUser = user
            return bcrypt.hash(updatedPassword,12)
        })
        .then((hashedPassword) => {
            if(!hashedPassword){
                throw new Error("update password: password hashing failed") 
            }
            currentUser.password = hashedPassword
            currentUser.resetToken = undefined
            currentUser.resetTokenExpiration = undefined
            return currentUser.save()
        })
        .then((result) => {
            if(!result){
                throw new Error("update password: failed to update password") 
            }
            console.log(result)
            return res.status(200).send("password reset successful")
        })
        .catch(err => {
            if(!currentUser) return res.status(402).send("token expired")
            return res.status(500).send("please contact engineer")
            console.log("postUpdatePassword err: ", err)
        })
}