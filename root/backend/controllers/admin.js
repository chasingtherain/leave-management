const User = require('../models/user')


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
                    const chengduLrsLeaveScheme = [
                        {name: "Annual Leave 年假", type:"annual", entitlement: 15, pending: 0, used: 0, rollover: true, note: "NA / 无"},
                        {name: "Compassionate Leave 慈悲假", type:"compassionate", entitlement: 3, pending: 0, used: 0, rollover: false, note: "Death of spouse, parents, children, parents-in-law: 3 days\n own/spouse's grandparents, own siblings: 1 day \n 配偶、父母、子女、岳父母死亡: 3天\n 自己/配偶的祖父母、自己的兄弟姐妹: 1天"},
                        {name: "Medical leave 病假", type:"medical", entitlement: 30, pending: 0, used: 0, rollover: false, note: "NA / 无"},
                        {name: "Hospitalisation leave 住院假", type:"hospitalisation", entitlement: 365, pending: 0, used: 0, rollover: false, note: "As prescribed by doctor\n按医生规定"},
                        {name: "Marriage Leave", type:"marriage", entitlement: 3, pending: 0, used: 0, rollover: false, note: "For newly married staff\n新婚"},
                        {name: "Maternity leave 产假", type:"maternity", entitlement: 158, pending: 0, used: 0, rollover: false, note: "15 days have to be taken before delivery\n分娩前必须服用15天"},
                        {name: "Miscarriage Leave 流产假", type:"miscarriage", entitlement: 45, pending: 0, used: 0, rollover: false, note: "Within 3 months of pregnancy: 30 days\nBetween 3 to 7 months: 45 days\n after 7 months: 15 days\n3个月内流产: 30天\n3至7个月内流产: 45天\n 7个月后流产: 15天"},
                        {name: "Natal Leave 受精相关假", type:"natal", entitlement: 365, pending: 0, used: 0, rollover: false, note: "As prescribed by doctor\n按医生规定"},
                        {name: "Paternity Leave 陪产假", type:"paternity", entitlement: 20, pending: 0, used: 0, rollover: false, note: "Male staff has to take leave within first week of child's birth\n 员工(男)必须在孩子出生第一周内用"},
                        {name: "Unpaid Leave 无薪假", type:"unpaid", entitlement: 365, pending: 0, used: 0, rollover: false, note: "NA / 无"},
                        {name: "Childcare Leave 育儿假", type:"childcare", entitlement: 10, pending: 0, used: 0, rollover: false, note: "Only for staff with kids 3 years old and below\n仅限带 3 岁及以下儿童的员工"},
                        {name: "Women's Day 妇女节假", type:"womenDay", entitlement: 0.5, pending: 0, used: 0, rollover: false, note: "Can be taken on or after International Women's Day\n可在国际妇女节当天或之后休假"},
                    ]

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
                        leave: chengduLrsLeaveScheme,
                        leaveHistory: [],
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

exports.postCreateLeaveType = (req,res,next) => {
    console.log(req.body)

    res.send("controller connected")
}