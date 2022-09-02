const User = require('../models/user')

exports.postCreateUser = (req,res,next) => {
    const name = req.body.name
    const isAdmin = req.body.isAdmin
    const email = req.body.email
    const createdOn = req.body.createdOn
    const lastUpdatedOn = req.body.lastUpdatedOn
    const ro = req.body.ro
    const reportingEmail = req.body.reportingEmail
    const co = req.body.co
    const coveringEmail = req.body.coveringEmail
    const isActive = req.body.isActive
    const leaveLeft = req.body.leaveLeft
    
    // console.log("req", req)
    console.log("req.body", req.body)
    console.log("req.body.isAdmin", req.body.isAdmin)

    const user = new User({
        name: name,
        isAdmin: isAdmin,
        email: email,
        createdOn: createdOn,
        lastUpdatedOn: lastUpdatedOn,
        ro: ro,
        reportingEmail: reportingEmail,
        co: co,
        coveringEmail: coveringEmail,
        isActive: isActive,
        leaveLeft: leaveLeft
    })

    user
        .save()
        .then(result => {
            console.log(result)
            console.log("user created")
        })
        .catch(err => {
            console.log(err)
        })

    res.status(200).send(user)
        
}