const User = require('../models/user')
const Leave = require('../models/leave')
const Workday = require('../models/workday')
const TeamCalendar = require('../models/teamCalendar')
const TeamCalendarRecord = require('../models/teamCalendarRecord')

const bcrypt = require('bcryptjs')

const sendgridMail = require('@sendgrid/mail')
const jwt = require('jsonwebtoken')

const date = new Date()
const currentYear = date.getFullYear()

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)

const chengduLrsLeaveScheme = [
    new Leave({name: "Annual Leave 年假", type:"annual", entitlement: 15, pending: 0, used: 0, rollover: true, year: date.getFullYear(), note: "NA / 无"}),
    new Leave({name: `Annual Leave 年额带过 (${currentYear-1})`, type:"prevYearAnnual", entitlement: 0, pending: 0, used: 0, rollover: true, year: date.getFullYear(), note: "NA / 无"}),
    new Leave({name: "Compassionate Leave 慈悲假", type:"compassionate", entitlement: 3, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "Death of spouse, parents, children, parents-in-law: 3 days\n own/spouse's grandparents, own siblings: 1 day \n 配偶、父母、子女、岳父母死亡: 3天\n 自己/配偶的祖父母、自己的兄弟姐妹: 1天"}),
    new Leave({name: "Medical leave 病假", type:"medical", entitlement: 30, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "NA / 无"}),
    new Leave({name: "Hospitalisation leave 住院假", type:"hospitalisation", entitlement: 365, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "As prescribed by doctor\n按医生规定"}),
    new Leave({name: "Marriage Leave", type:"marriage", entitlement: 3, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "For newly married staff\n新婚"}),
    new Leave({name: "Maternity leave 产假", type:"maternity", entitlement: 158, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "15 days have to be taken before delivery\n分娩前必须服用15天"}),
    new Leave({name: "Miscarriage Leave 流产假", type:"miscarriage", entitlement: 45, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "Within 3 months of pregnancy: 30 days\nBetween 3 to 7 months: 45 days\n after 7 months: 15 days\n3个月内流产: 30天\n3至7个月内流产: 45天\n 7个月后流产: 15天"}),
    new Leave({name: "Natal Leave 受精相关假", type:"natal", entitlement: 365, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "As prescribed by doctor\n按医生规定"}),
    new Leave({name: "Paternity Leave 陪产假", type:"paternity", entitlement: 20, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "Male staff has to take leave within first week of child's birth\n 员工(男)必须在孩子出生第一周内用"}),
    new Leave({name: "Unpaid Leave 无薪假", type:"unpaid", entitlement: 365, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "NA / 无"}),
    new Leave({name: "Childcare Leave 育儿假", type:"childcare", entitlement: 10, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "Only for staff with kids 3 years old and below\n仅限带 3 岁及以下儿童的员工"}),
    new Leave({name: "Women's Day 妇女节假", type:"womenDay", entitlement: 0.5, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "Can be taken on or after International Women's Day\n可在国际妇女节当天或之后休假"}),
]

exports.postCreateUser = (req,res,next) => {
    const name = req.body.name
    const isAdmin = req.body.isAdmin
    const email = req.body.email
    const password = req.body.password
    const createdOn = req.body.createdOn
    const lastUpdatedOn = req.body.lastUpdatedOn
    // const ro = req.body.ro
    const reportingEmail = req.body.reportingEmail
    // const co = req.body.co
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
                    const user = new User({
                        name: name,
                        isAdmin: isAdmin,
                        email: email,
                        password: hashedPassword,
                        createdOn: createdOn,
                        lastUpdatedOn: lastUpdatedOn,
                        // ro: ro,
                        reportingEmail: reportingEmail,
                        // co: co,
                        coveringEmail: coveringEmail,
                        leave: chengduLrsLeaveScheme,
                        leaveHistory: [],
                        staffLeave: [],
                        sessionToken: jwt.sign({email}, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '7d'})
                    })
                
                user
                    .save()
                    .then(result => {

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

exports.postDeleteUser = (req,res,next) => {
    const email = req.body.email
    // console.log(req.body)
    User.deleteOne({email: email})
        .then((result)=> {
            console.log(result)
            res.send("user deleted")
        })
        .catch(err => {
            console.log(err)
        })


}

exports.postCreateLeaveType = (req,res,next) => {
    console.log(req.body)

    res.send("controller connected")
}

exports.approveLeave = (req,res,next) => {
    // update reporting's staffLeave
    // update staff's leaveHistory
    // send approval email

    const staffEmail = req.body.staffEmail
    const coveringEmail = req.body.coveringEmail
    const reportingEmail = req.body.reportingEmail
    const dateRange = req.body.dateRange
    const leaveType = req.body.leaveType
    const leaveStatus = req.body.leaveStatus
    const numOfDaysTaken = req.body.numOfDaysTaken
    const submittedOn = req.body.submittedOn
    const startDateUnix = new Date(req.body.start).getTime()
    const endDateUnix = new Date(req.body.end).getTime()
    const startDate = req.body.start
    const endDate = req.body.end

    const staffName = req.body.staffName
    
    const getFirstDayOfYear = (year) => {return new Date(year, 0, 1)}
    const currentYear = new Date().getFullYear();
    const firstDayofCurrentYear = getFirstDayOfYear(currentYear).getTime()
    
    console.log("req.body: ", req.body)
    console.log(startDateUnix, startDate, firstDayofCurrentYear, startDateUnix >= firstDayofCurrentYear)

    if (leaveStatus === "pending"){
        // update reporting's staffLeave
        User.findOneAndUpdate(
            {
                email: reportingEmail,
                "staffLeave.staffEmail": staffEmail,
                "staffLeave.timePeriod": dateRange,
                "staffLeave.quotaUsed": numOfDaysTaken,
                "staffLeave.leaveType": leaveType,
                "staffLeave.submittedOn": submittedOn,
                "staffLeave.status": leaveStatus,
            },
            {$set: {"staffLeave.$.status": "approved" }}
            )
        .then((user)=>{
            // console.log(user)
            return user.save()
        })
        .then(() => {
            // update team calendar
            const teamCalendarRecord = new TeamCalendarRecord({
                start: startDate,
                end: endDate,
                startDateUnix: startDateUnix,
                endDateUnix: endDateUnix,
                staffName: staffName,
                title: `${staffName} on leave`,
                status: "approved"
            })
            // console.log("teamCalendarRecord:", teamCalendarRecord)
            return TeamCalendar.findOneAndUpdate(
                {team: "chengdu"},
                {
                    $set: {"team": "chengdu"},
                    $push: {"approvedLeave": teamCalendarRecord}
                },
                {upsert: true}
            )
        })
        .then(record => {
            console.log("record created on team calendar")
            return record.save()
        })
        .then(()=>{
            User.findOneAndUpdate( // update user's leave status to approved
                {
                    email: staffEmail,
                    "leaveHistory.leaveType": leaveType,
                    "leaveHistory.timePeriod": dateRange,
                    "leaveHistory.quotaUsed": numOfDaysTaken,
                    "leaveHistory.submittedOn": submittedOn,
                    "leaveHistory.status": leaveStatus,
                },
                {$set: {"leaveHistory.$.status": "approved" }}
                )
                .then((result)=>{
                // update pending and quotaUsed count after rejection 
                    User.findOneAndUpdate({email: staffEmail, "leave.name":leaveType}, 
                    { 
                        $inc: {"leave.$.pending": -numOfDaysTaken, "leave.$.used": numOfDaysTaken},
                    })
                    .then((outcome)=> {
                        // console.log(outcome)
                        console.log("subtracted from pending, added quotaUsed count")
    
                        // send approval email 
                        const approvalEmail = {
                            to: staffEmail, //leave applier's email
                            from: 'mfachengdu@gmail.com', // Change to your verified sender
                            cc: [coveringEmail, reportingEmail],
                            subject: `Leave Approved 休假请求已获批准 - ${dateRange}`,
                            html: `
                                <div>
                                    <p>Hi ${staffEmail}, your leave from <strong>${dateRange}</strong> has been approved.</p> 
                                    <p>Leave Details: </p>
                                    <p>Type: ${leaveType}</p>
                                    <p>Number of days: ${numOfDaysTaken} days</p>
                                    <p>Period: <strong>${dateRange}</strong></p>
                                </div>
                                <div>
                                    <p>您好 ${staffEmail}，您从${dateRange}的休假请求已获批准</p> 
                                    <p>信息：</p>
                                    <p>休假类型: ${leaveType}</p>
                                    <p>天数: ${numOfDaysTaken} days</p>
                                    <p>何时: <strong>${dateRange}</strong></p>
                                </div>
                            `
                            }
                        sendgridMail
                            .send(approvalEmail) // email to inform user and covering of leave request
                            .then(() => {
                                res.status(200).send("approval email sent to user, covering and reporting")
                                console.log('approval email sent to user and covering')
                            })
                            .catch((error) => {
                                console.error("sendgrid error during approval email: ", error)
                                console.log("err: ", error.response.body)
                            })
                    })
                    .catch(err => console.log(err))
                    console.log("status updated to approved on user's table")
                })
        })
        .catch((err)=> console.log(err))
    }
    
    if(leaveStatus === "pending cancellation" && startDateUnix >= firstDayofCurrentYear){
        // scenario: staff wants to cancel an approved leave from the current year
        // update RO's leave record to cancellation approved
        User.findOneAndUpdate(
            {
                email: reportingEmail,
                "staffLeave.staffEmail": staffEmail,
                "staffLeave.timePeriod": dateRange,
                "staffLeave.quotaUsed": numOfDaysTaken,
                "staffLeave.leaveType": leaveType,
                "staffLeave.submittedOn": submittedOn,
                "staffLeave.status": leaveStatus,
            },
            {$set: {"staffLeave.$.status": "cancellation approved" }}
            )
        .then(()=>{
            console.log("updated RO's status to cancellation approved")

            // update user's leave status to cancellation approved
            return User.findOneAndUpdate( 
            {
                email: staffEmail,
                "leaveHistory.leaveType": leaveType,
                "leaveHistory.timePeriod": dateRange,
                "leaveHistory.quotaUsed": numOfDaysTaken,
                "leaveHistory.submittedOn": submittedOn,
                "leaveHistory.status": leaveStatus,
            },
            {$set: {"leaveHistory.$.status": "cancellation approved" }}
            )
        })
        .then((res)=>{
            console.log("updated staff's status to cancellation approved")

            // reduce quotaUsed count
            return User.findOneAndUpdate({email: staffEmail, "leave.name":leaveType}, 
            { 
                $inc: {"leave.$.used": -numOfDaysTaken},
            })

        })
        .then(()=> {
            // remove from team leave record
            console.log("adjusted quota used value")
            console.log("deleting from team calendar")
            return TeamCalendar.updateOne(
                {team: "chengdu"},
                {$pull: {approvedLeave: {start: startDate.toString(),end: endDate.toString()}}}
            )
            .catch(err => console.log("err deleting team calendar record",err))
        })
        .then(()=> {
            // send cancellation approval email 
            const cancellationApprovalEmail = {
                to: staffEmail, //leave applier's email
                from: 'mfachengdu@gmail.com', // Change to your verified sender
                cc: [coveringEmail, reportingEmail],
                subject: `Leave Cancellation Approved 休假请求取消已获批准 - ${dateRange}`,
                html: `
                    <div>
                        <p>Hi ${staffEmail}, your leave cancellation from <strong>${dateRange}</strong> has been approved.</p> 
                    </div>
                    <div>
                        <p>您好 ${staffEmail}，您从${dateRange}的休假取消请求已获批准</p> 
                    </div>
                `
                }
            sendgridMail
                .send(cancellationApprovalEmail) // email to inform user and covering of leave request
                .then(() => {
                    res.status(200).send("cancellation approval email sent to user, covering and reporting")
                    console.log('cancellation approval email sent to user and covering')
                })
                .catch((error) => {
                    console.error("sendgrid error during cancellation approval email: ", error)
                    console.log("err: ", error.response.body)
                })
        })
    }

    if(leaveStatus === "pending cancellation" && startDateUnix < firstDayofCurrentYear){
        // scenario: staff wants to cancel an approved leave from the prev year

        if (leaveType !== "Annual Leave 年假"){
            console.log("only annual leave from prev year can be cancelled!")
            return res.status(401).send("only annual leave from prev year can be cancelled!")
        }

        // update RO's leave record to cancellation approved
        User.findOneAndUpdate(
            {
                email: reportingEmail,
                "staffLeave.staffEmail": staffEmail,
                "staffLeave.timePeriod": dateRange,
                "staffLeave.quotaUsed": numOfDaysTaken,
                "staffLeave.leaveType": leaveType,
                "staffLeave.submittedOn": submittedOn,
                "staffLeave.status": leaveStatus,
            },
            {$set: {"staffLeave.$.status": "cancellation approved" }}
            )
        .then(()=>{
            console.log("updated RO's status to cancellation approved")

            // update user's leave status to cancellation approved
            return User.findOneAndUpdate( 
            {
                email: staffEmail,
                "leaveHistory.leaveType": leaveType,
                "leaveHistory.timePeriod": dateRange,
                "leaveHistory.quotaUsed": numOfDaysTaken,
                "leaveHistory.submittedOn": submittedOn,
                "leaveHistory.status": leaveStatus,
            },
            {$set: {"leaveHistory.$.status": "cancellation approved" }}
            )
        })
        .then((res)=>{
            console.log("updated staff's status to cancellation approved")

            // increment Annual Leave 年额带过 count
            return User.findOneAndUpdate({email: staffEmail, "leave.name": `Annual Leave 年额带过 (${currentYear-1})`}, 
            { 
                $inc: {"leave.$.entitlement": numOfDaysTaken},
            })

        })
        .then(()=> {
            // send cancellation approval email 
            const cancellationApprovalEmail = {
                to: staffEmail, //leave applier's email
                from: 'mfachengdu@gmail.com', // Change to your verified sender
                cc: [coveringEmail, reportingEmail],
                subject: `Leave Cancellation Approved 休假请求取消已获批准 - ${dateRange}`,
                html: `
                    <div>
                        <p>Hi ${staffEmail}, your leave cancellation from <strong>${dateRange}</strong> has been approved.</p> 
                    </div>
                    <div>
                        <p>您好 ${staffEmail}，您从${dateRange}的休假取消请求已获批准</p> 
                    </div>
                `
                }
            sendgridMail
                .send(cancellationApprovalEmail) // email to inform user and covering of leave request
                .then(() => {
                    res.status(200).send("cancellation approval email sent to user, covering and reporting")
                    console.log('cancellation approval email sent to user and covering')
                })
                .catch((error) => {
                    console.error("sendgrid error during cancellation approval email: ", error)
                    console.log("err: ", error.response.body)
                })
        })
    }
}

exports.rejectLeave = (req,res,next) => {
    // update reporting's staffLeave
    // update staff's leaveHistory
    // send rejection email

    const staffEmail = req.body.staffEmail
    const coveringEmail = req.body.coveringEmail
    const reportingEmail = req.body.reportingEmail
    const dateRange = req.body.dateRange
    const leaveType = req.body.leaveType
    const leaveStatus = req.body.leaveStatus
    const numOfDaysTaken = req.body.numOfDaysTaken
    const submittedOn = req.body.submittedOn
    console.log(req.body)

    if (leaveStatus === "pending"){
        // update pending count after rejection
        User.findOneAndUpdate({email: staffEmail, "leave.name":leaveType}, 
            { 
                $inc: {"leave.$.pending": -numOfDaysTaken},
            }
        )
        .then(() => {
            // update reporting's staffLeave to rejected
            return User.findOneAndUpdate(
                {
                    email: reportingEmail,
                    "staffLeave.staffEmail": staffEmail,
                    "staffLeave.timePeriod": dateRange,
                    "staffLeave.quotaUsed": numOfDaysTaken,
                    "staffLeave.leaveType": leaveType,
                    "staffLeave.submittedOn": submittedOn,
                },
                {$set: {"staffLeave.$.status": "rejected" }}
                )
        })
        .then((res)=>{
            console.log("update reporting's staffLeave to rejected: ", res)
            return User.findOneAndUpdate( // update user's leave status to rejected
            {
                email: staffEmail,
                "leaveHistory.leaveType": leaveType,
                "leaveHistory.timePeriod": dateRange,
                "leaveHistory.quotaUsed": numOfDaysTaken,
                "leaveHistory.submittedOn": submittedOn,
                "leaveHistory.status": leaveStatus,
            },
            {$set: {"leaveHistory.$.status": "rejected" }} // rejected
            )
        })
        .then(()=> {
            // send rejection email

            const rejectionEmail = {
            to: staffEmail, //leave applier's email
            from: 'mfachengdu@gmail.com', // Change to your verified sender
            cc: [coveringEmail, reportingEmail], // covering and reporting's email
            subject: `Leave Rejected 休假请求已被拒绝 - ${dateRange}`,
            html: `
                <div>
                    <p>Hi ${staffEmail}, your leave from <strong>${dateRange}</strong> has been rejected.</p> 
                        <p>For more details, do speak to your reporting officer</p>
                </div>
                <div>
                    <p>您好 ${staffEmail}，您从${dateRange}的休假请求已被拒绝</p> 
                    <p>详细细节请问主管，谢谢</p> 

                </div>
            `
            }
            sendgridMail
                .send(rejectionEmail) // email to inform user and covering of leave request
                .then(() => {
                    res.send("status updated to rejected on user and reporting officer's table")
                    console.log('rejection email sent to user and covering')
                })
                .catch((error) => {
                    console.error("sendgrid error during rejection email: ", error)
                    console.log("err: ", error.response.body)
                })
        })
        .catch(err => console.log("pending count adjustment for rejected leave err:", err))
    }
    
    if(leaveStatus === "pending cancellation"){
        // scenario: current year's leave was approved and consumed but staff cancelled it (i.e. applied date has passed)
        // requires RO's approval to cancel past leave
        // no leave adjustments required

         // update reporting's staffLeave to rejected
        return User.findOneAndUpdate(
            {
                email: reportingEmail,
                "staffLeave.staffEmail": staffEmail,
                "staffLeave.timePeriod": dateRange,
                "staffLeave.quotaUsed": numOfDaysTaken,
                "staffLeave.leaveType": leaveType,
                "staffLeave.submittedOn": submittedOn,
            },
            {$set: {"staffLeave.$.status": "cancellation rejected" }}
        )
        .then(()=>{
            console.log("update reporting's staffLeave to cancellation rejected: ", res)
            return User.findOneAndUpdate( // update user's leave status to cancellation rejected
            {
                email: staffEmail,
                "leaveHistory.leaveType": leaveType,
                "leaveHistory.timePeriod": dateRange,
                "leaveHistory.quotaUsed": numOfDaysTaken,
                "leaveHistory.submittedOn": submittedOn,
                "leaveHistory.status": leaveStatus,
            },
            {$set: {"leaveHistory.$.status": "cancellation rejected" }} // cancellation rejected
            )
        })
        .then(()=>{
            // send cancellation rejected email

            const cancellationRejectedEmail = {
                to: staffEmail, //leave applier's email
                from: 'mfachengdu@gmail.com', // Change to your verified sender
                cc: [coveringEmail, reportingEmail], // covering and reporting's email
                subject: `Leave Cancellation Rejected 休假请求已被拒绝 - ${dateRange}`,
                html: `
                    <div>
                        <p>Hi ${staffEmail}, your request to cancel leave from <strong>${dateRange}</strong> has been rejected.</p> 
                            <p>For more details, do speak to your reporting officer</p>
                    </div>
                    <div>
                        <p>您好 ${staffEmail}，您从${dateRange}的休假取消请求已被拒绝</p> 
                        <p>详细细节请问主管，谢谢</p> 
    
                    </div>
                `
                }
                sendgridMail
                    .send(cancellationRejectedEmail) // email to inform user and covering of leave request
                    .then(() => {
                        res.send("status updated to cancellation rejected on user and reporting officer's table")
                        console.log('rejection email sent to user and covering')
                    })
                    .catch((error) => {
                        console.error("sendgrid error during cancellation rejection email: ", error)
                        console.log("err: ", error.response.body)
                    })
        })
    }

}

exports.getUserInfoByEmail = (req,res,next) => {
    const userEmail = req.params.id
    console.log("req.params: ", req.params)
    User
        .findOne({email: userEmail})
        .then(user => {
            if(!user){
                return res.status(400).send("user not found")
            }
            res.status(200).send(
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
                    staffLeave: user.staffLeave
                })
        })
        .catch( err =>console.log("getUserInfoByEmail err:", err))
}

exports.postUpdateUser = (req,res,next) => {
    const userEmail = req.body.userEmail
    const newReportingEmail = req.body.newReportingEmail
    const newCoveringEmail = req.body.newCoveringEmail
    console.log("req.body: ", req.body)

    // update reporting's email
    if (newReportingEmail) {
        User.findOneAndUpdate(
            {email: userEmail,},
            {$set: {"reportingEmail": newReportingEmail }}
        )
        .then((result)=>{
            // console.log(result)
        })
        .catch((err)=> console.log("update reporting email error: ", err))
    }
    // update covering's email
    if (newCoveringEmail) {
        User.findOneAndUpdate(
            {email: userEmail,},
            {$set: {"coveringEmail": newCoveringEmail }}
        )
        .then((result)=>{
            // console.log(result)
        })
        .catch((err)=> console.log("update covering email error: ", err))
    }
    res.status(200).send("update successful")
}

exports.getWorkDay = (req,res,next) => {
    const userEmail = req.params.id
    console.log("req.params: ", req.params)
    Workday
        .findOne({entity:"chengdu"})
        .then(record => {
            // console.log(record)
            res.status(200).json(
                {
                    holiday: record.holiday,
                    workday: record.workday
                })
        })
        .catch( err =>console.log("getWorkDay err:", err))
}

exports.setWorkDay = (req,res,next) => {
    const workDaySelection = req.body.workDaySelection
    const holidaySelection = req.body.holidaySelection
    const entity = req.body.entity

    console.log("req.body: ", req.body)

    Workday.findOneAndUpdate(
        {entity: entity},
        {$set: {"workday": workDaySelection, "holiday": holidaySelection}},
        {upsert: true}
    )
    .then((result)=>{
        console.log(result)
    })
    .catch((err)=> console.log(err))

    // save selections in a new collection
    // return status 200

}

exports.postSendReminder = (req,res,next) => {
    const leaveCount = req.body.leaveCount
    const emailList = req.body.targetEmailList
    console.log("req.body: ", req.body)

    const reminderEmail = {
    to: emailList, 
    from: 'mfachengdu@gmail.com', // Change to your verified sender
    subject: 'Clear your leave 请假吧',
    html: `
        <div>
            <p>Hi, the year is ending and you still have at least ${leaveCount} days of annual leave </p> 
            <p>Start making year end leave plans with your family, friends and colleagues!</p>
            <p>Apply leave <a href="${process.env.FRONTENDURL}/login"> here </a> </p>
        </div>
    `
    }

    sendgridMail
        .send(reminderEmail)
        .then(() => {
            res.send("clear leave reminder email sent to user")
            console.log('clear leave reminder email sent to user')
        })
        .catch((error) => {
            console.error("clear leave reminder email sendgrid error: ", error)
        })
}