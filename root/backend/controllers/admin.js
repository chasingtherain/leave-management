const User = require('../models/user')

const bcrypt = require('bcryptjs')

const sendgridMail = require('@sendgrid/mail')


exports.postCreateUser = (req,res,next) => {
    const name = req.body.name
    const isAdmin = req.body.isAdmin
    const email = req.body.email
    const password = req.body.password
    const createdOn = req.body.createdOn
    const lastUpdatedOn = req.body.lastUpdatedOn
    const ro = req.body.ro
    const reportingEmail = req.body.reportingEmail
    const co = req.body.co
    const coveringEmail = req.body.coveringEmail
    const leaveLeft = req.body.leaveLeft
    
    User.findOne({email: email})
        .then(userDoc => {
            if(userDoc){
                console.log(userDoc)
                return res.status(499).send("email already exist")
                // return res.redirect(`${process.env.FRONTENDURL}/create-user`)
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        name: name,
                        isAdmin: isAdmin,
                        email: email,
                        password: hashedPassword,
                        createdOn: createdOn,
                        lastUpdatedOn: lastUpdatedOn,
                        ro: ro,
                        reportingEmail: reportingEmail,
                        co: co,
                        coveringEmail: coveringEmail,
                        leaveLeft: leaveLeft
                    })
                
                user
                    .save()
                    .then(result => {
                        sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)
                        const msg = {
                        to: email, 
                        from: 'mfachengdu@gmail.com', // Change to your verified sender
                        subject: 'Welcome to LeavePlan 休划欢迎您加入',
                        html: `
                            <div>
                                <p>Welcome to LeavePlan </p> 
                                <p> Click <a href="${process.env.FRONTENDURL}/login"> here </a> to start making leave plans!</p>
                            </div>
                            <div>
                                <p>Welcome to LeavePlan </p> 
                                <p> 点击 <a href="${process.env.FRONTENDURL}/login"> 此链接 </a> 开始申请休假</p>
                            </div>
                        `
                        }
                        sendgridMail
                            .send(msg)
                            .then(() => {
                                console.log('acc creation email sent to user')
                            })
                            .catch((error) => {
                                console.error("sendgrid error: ", error)
                            })
                        console.log("user created")
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    res.status(200).send(user)   
                })
        })
        .catch(err => {
            console.log(err)
        })


}