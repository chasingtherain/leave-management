const User = require('../models/user')
const Leave = require('../models/leave')


const bcrypt = require('bcryptjs')

const sendgridMail = require('@sendgrid/mail')

const chengduLrsLeaveScheme = {
    "annual": 15,
    "compassionate": 3,
    "medical": 30,
    "hospitalisation": 365,
    "maternity": 158,
    "miscarriage": 45,
    "natal": 365,
    "paternity": 30,
    "unpaid": 365,
    "childcare": 10,
    "womenDay": 0.5
}

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
                    const chengduLrsLeaveScheme = new Leave({
                        annual: {entitlement: 15, used: 0, rollover: true, note: "Unused leave can be brought over to next year"},
                        compassionate: {entitlement: 3, used: 0, rollover: false, note: "3 days for death of immediate family (defined as spouse, parents, children, parents-in-law) \n 1 day for non-immediate family (defined as own/spouse’s grandparents, siblings)"},
                        medical: {entitlement: 30, used: 0, rollover: false, note: ""},
                        hospitalisation: {entitlement: 365, used: 0, rollover: false, note: "As prescribed by doctor"},
                        marriage: {entitlement: 3, used: 0, rollover: false, note: "For newly married staff"},
                        maternity: {entitlement: 158, used: 0, rollover: false, note: "15 days of maternity leave have to be taken before pregnancy"},
                        miscarriage: {entitlement: 45, used: 0, rollover: false, note: "30 days for those who suffered miscarriage within 3 months of pregnancy\n45 days for miscarriages between 3 to 7 months\n15 days for miscarriages later than 7 months of pregnancy"},
                        natal: {entitlement: 365, used: 0, rollover: false, note: "As prescribed by doctor"},
                        paternity: {entitlement: 20, eligible: "Male staff", used: 0, rollover: false, note: "Male staff has to take leave within first week of child’s birth"},
                        unpaid: {entitlement: 365, used: 0, rollover: false, note: ""},
                        childcare: {entitlement: 10, used: 0, rollover: false, note: "Only for staff with kids 3 years old and below"},
                        womenDay: {entitlement: 0.5, used: 0, rollover: false, note: "Female staff can take this leave on or after International Women's Day"},
                    })

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
                        leave: chengduLrsLeaveScheme
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