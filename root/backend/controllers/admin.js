const User = require('../models/user')
const Leave = require('../models/leave')
const Workday = require('../models/workday')
const TeamCalendar = require('../models/teamCalendar')
const TeamCalendarRecord = require('../models/teamCalendarRecord')

const bcrypt = require('bcryptjs')
const sendgridMail = require('@sendgrid/mail')
const jwt = require('jsonwebtoken')
const io = require('../socket')

const date = new Date()
const currentYear = date.getFullYear()

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)

const chengduLrsLeaveScheme = [
    new Leave({name: "Annual Leave 年假", type:"annual", entitlement: 15, pending: 0, used: 0, rollover: true, year: date.getFullYear(), note: "NA / 无"}),
    new Leave({name: `Annual Leave 年额带过 (${currentYear-1})`, type:"prevYearAnnual", entitlement: 0, pending: 0, used: 0, rollover: true, year: date.getFullYear(), note: "NA / 无"}),
    new Leave({name: "Compassionate Leave 丧假", type:"compassionate", entitlement: 3, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "Death of spouse, parents, children, parents-in-law: 3 days\n own/spouse's grandparents, own siblings: 1 day \n 配偶、父母、子女、岳父母死亡: 3天\n 自己/配偶的祖父母、自己的兄弟姐妹: 1天"}),
    new Leave({name: "Medical leave 病假", type:"medical", entitlement: 30, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "NA / 无"}),
    new Leave({name: "Hospitalisation leave 住院假", type:"hospitalisation", entitlement: 365, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "As prescribed by doctor\n按医生规定"}),
    new Leave({name: "Marriage Leave 婚假", type:"marriage", entitlement: 3, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "For newly married staff\n新婚"}),
    new Leave({name: "Maternity leave 产假", type:"maternity", entitlement: 158, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "15 days have to be taken before delivery\n分娩前必须服用15天"}),
    new Leave({name: "Miscarriage Leave 流产假", type:"miscarriage", entitlement: 45, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "Within 3 months of pregnancy: 30 days\nBetween 3 to 7 months: 45 days\n after 7 months: 15 days\n3个月内流产: 30天\n3至7个月内流产: 45天\n 7个月后流产: 15天"}),
    new Leave({name: "Natal Leave 受精相关假", type:"natal", entitlement: 365, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "As prescribed by doctor\n按医生规定"}),
    new Leave({name: "Paternity Leave 陪产假", type:"paternity", entitlement: 20, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "Male staff has to take leave within first week of child's birth\n 员工(男)必须在孩子出生第一周内用"}),
    new Leave({name: "Unpaid Leave 无薪假", type:"unpaid", entitlement: 365, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "NA / 无"}),
    new Leave({name: "Childcare Leave 育儿假", type:"childcare", entitlement: 10, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "Only for staff with kids 3 years old and below\n仅限带 3 岁及以下儿童的员工"}),
    new Leave({name: "Women's Day 三、八妇女节", type:"womenDay", entitlement: 0.5, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "Can be taken on or after International Women's Day\n可在国际妇女节当天或之后休假"}),
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
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        name: name,
                        isAdmin: isAdmin,
                        email: email,
                        password: hashedPassword,
                        createdOn: moment(createdOn).format("YYYY/MM/DD H:mm:ss"),
                        lastUpdatedOn: moment(lastUpdatedOn).format("YYYY/MM/DD H:mm:ss"),
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
                        if (!result){
                            throw new Error("create user: user creation failed") 
                        }
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
                        return res.status(200).send(user)   
                    })
                })
        })
        .catch((err)=> {
            console.log("failed to create user", err)
            return res.status(400).send(`failed to create user ${err}`)
        })


}

exports.postDeleteUser = (req,res,next) => {
    const email = req.body.email
    // console.log(req.body)
    User.deleteOne({email: email})
        .then((user)=> {
            if (!user){
                throw new Error("delete user: did not find user record in db") 
            }
            console.log("user: ", user)
            return res.send("user deleted")
        })
        .catch((err)=> {
            console.log("failed to delete user", err)
            return res.status(400).send(`failed to delete user ${err}`)
        })


}

exports.postCreateLeaveType = (req,res,next) => {
    console.log(req.body)

    return res.send("controller connected")
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
    const leaveClassification = req.body.leaveClassification

    const staffName = req.body.staffName
    
    const getFirstDayOfYear = (year) => {return new Date(year, 0, 1)}
    const currentYear = new Date().getFullYear();
    const firstDayofCurrentYear = getFirstDayOfYear(currentYear).getTime()
    
    console.log("req.body: ", req.body)
    console.log(startDateUnix, startDate, firstDayofCurrentYear, startDateUnix >= firstDayofCurrentYear)

    if (leaveStatus === "pending"){ //scenario: normal leave application flow

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
            if (!user){
                throw new Error("approve leave: did not find user record in db") 
            }
            console.log("updated reporting's staffLeave")
            // console.log(user)
            return user.save()
        })
        .then((user) => {
            if (!user){
                throw new Error("approve leave: failed to upder user record in db") 
            }
            // update team calendar
            const teamCalendarRecord = new TeamCalendarRecord({
                start: startDate,
                end: endDate,
                type: "leave",
                startDateUnix: startDateUnix,
                endDateUnix: endDateUnix,
                staffName: staffName,
                title: `${staffName} ${leaveClassification} leave`,
                status: "approved"
            })
            teamCalendarRecord
                .save()
                .then((teamCalResult)=> {
                    if(!teamCalResult){
                        throw new Error("failed to create team calendar record")
                    }
                    console.log("team calendar record created")

                    // broadcast calendar record creation event to all users for dynamic calendar update
                    io.getIO().emit('calendar', { action: 'create', calendarRecord: teamCalendarRecord})
                })
                .catch(err => {
                    console.log("err: ", err)
                    return res.status(400).send("failed to create team calendar record")
                })
                
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
            if (!record){
                throw new Error("approve leave: failed to find team calendar record") 
            }
            console.log("record created on team calendar")
            return record.save()
        })
        .then((result)=>{
            if (!result){
                throw new Error("approve leave: failed to add approved leave to team calendar") 
            }
            return User.findOneAndUpdate( // update user's leave status to approved
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
        })
        .then((result) => {
            if (!result){
                throw new Error("approve leave: failed to update leave status to approved") 
            }
            // update pending and quotaUsed count after rejection 
                return User.findOneAndUpdate({email: staffEmail, "leave.name":leaveType}, 
                { 
                    $inc: {"leave.$.pending": -numOfDaysTaken, "leave.$.used": numOfDaysTaken},
                })
            })
        .then((result)=> {
            if (!result){
                throw new Error("approve leave: failed to adjust pending and used leave count") 
            }
            console.log("subtracted from pending, added quotaUsed count")

            // send approval email 
            const approvalEmail = {
                to: staffEmail, //leave applier's email
                from: 'mfachengdu@gmail.com',
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
                    return res.status(200).send("approval email sent to user, covering and reporting")
                    console.log('approval email sent to user and covering')
                })
                .catch((error) => {
                    console.error("sendgrid error during approval email: ", error)
                    console.log("err: ", error.response.body)
                })
        })
        .catch((err)=> {
            console.log("failed to approve leave", err)
            return res.status(400).send(`failed to approve leave: ${err}`)
        })
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
        .then((user)=>{
            if(!user){
                throw new Error("approve leave(cancel approved): did not find user record in db") 
            }
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
        .then((result)=>{
            if(!result){
                throw new Error(`approve leave(cancel approved): failed to update status to cancellation approved, result: ${result}`) 
            }
            console.log("updated staff's status to cancellation approved")

            // reduce quotaUsed count
            return User.findOneAndUpdate({email: staffEmail, "leave.name":leaveType}, 
            { 
                $inc: {"leave.$.used": -numOfDaysTaken},
            })

        })
        .then((result)=> {
            if(!result){
                throw new Error("approve leave(cancel approved): failed to adjust used count") 
            }
            // remove from team leave record
            console.log("adjusted quota used value")
            console.log("deleting from team calendar")

            const deletedTeamCalendarRecord = 
            {
                startDateUnix: startDateUnix.toString(), 
                endDateUnix: endDateUnix.toString(), 
                staffName: staffName
            }
            
            // update client to delete cal record in real time
            io.getIO().emit('calendar', { action: 'delete', calendarRecord: deletedTeamCalendarRecord})

            return TeamCalendar.updateOne(
                {team: "chengdu"},
                {$pull: {approvedLeave: {startDateUnix: startDateUnix.toString(),endDateUnix: endDateUnix.toString(), staffName: staffName, type: "leave"}}}
            )
        })
        .then((teamCalResult)=> {
            if(!teamCalResult){
                throw new Error("approve leave(cancel approved): err deleting team calendar record") 
            }

            console.log(teamCalResult)
            // send cancellation approval email 
            const cancellationApprovalEmail = {
                to: staffEmail, //leave applier's email
                from: 'mfachengdu@gmail.com',
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
                    return res.status(200).send("cancellation approval email sent to user, covering and reporting")
                    console.log('cancellation approval email sent to user and covering')
                })
                .catch((error) => {
                    console.error("sendgrid error during cancellation approval email: ", error)
                    console.log("err: ", error.response.body)
                })
        })
        .catch(err => {
            return res.status(400).send( `failed to approve leave cancellation: ${err}`)
            console.log("failed to approve leave cancellation", err)
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
        .then((user)=>{
            if(!user){
                throw new Error("approve leave(cancel approved leave from prev year): unable to find user") 
            }
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
        .then((result)=>{
            if(!result){
                throw new Error("approve leave(cancel approved leave from prev year): failed to update user leave status to cancellation approved") 
            }
            console.log("updated staff's status to cancellation approved")

            // increment Annual Leave 年额带过 count
            return User.findOneAndUpdate({email: staffEmail, "leave.name": `Annual Leave 年额带过 (${currentYear-1})`}, 
            { 
                $inc: {"leave.$.entitlement": numOfDaysTaken},
            })

        })
        .then((result)=> {
            if(!result){
                throw new Error("approve leave(cancel approved leave from prev year): failed to update entitlement count") 
            }
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
                    return res.status(200).send("cancellation approval email sent to user, covering and reporting")
                    console.log('cancellation approval email sent to user and covering')
                })
                .catch((error) => {
                    console.error("sendgrid error during cancellation approval email: ", error)
                    console.log("err: ", error.response.body)
                })
        })
        .catch((err)=> {
            console.log("failed to approve leave", err)
            return res.status(400).send(`failed to approve leave: ${err}`)
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
        .then((user) => {
            if(!user){
                throw new Error("did not find user record in db while rejecting leave") 
            }

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
        .then((reportingOfficer)=>{
            if(!reportingOfficer){
                throw new Error("reject leave: did not find reporting officer record in db") 
            }
            
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
        .then((staff)=> {
            if(!staff){
                throw new Error("reject leave: could not find staff record in db") 
            }

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
                    return res.send("status updated to rejected on user and reporting officer's table")
                    console.log('rejection email sent to user and covering')
                })
                .catch((error) => {
                    console.error("sendgrid error during rejection email: ", error)
                    console.log("err: ", error.response.body)
                })
        })
        .catch(err => {
            console.log("pending count adjustment for rejected leave err:", err)
            return res.status(400).json(`pending count adjustment for rejected leave err: ${err}`)
        })
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
            {$set: {"staffLeave.$.status": "approved" }}
        )
        .then((reporting)=>{
            if(!reporting){
                throw new Error("reject leave (pending cancellation): could not find reporting officer record in db") 
            }
            console.log("update reporting's staffLeave back to approved: ", res)
            return User.findOneAndUpdate( // update user's leave status back to approved to provide flexibility for cancellation reapplication
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
        })
        .then((staff)=>{
            if(!staff){
                throw new Error("reject leave (pending cancellation): could not find staff record in db") 
            }

            // send cancellation rejected email
            const cancellationRejectedEmail = {
                to: staffEmail, //leave applier's email
                from: 'mfachengdu@gmail.com', // Change to your verified sender
                cc: [coveringEmail, reportingEmail], // covering and reporting's email
                subject: `Leave Cancellation Rejected 休假请求已被拒绝 - ${dateRange}`,
                html: `
                    <div>
                        <p>Hi ${staffEmail}, your request to cancel leave from <strong>${dateRange}</strong> has been rejected.</p> 
                            <p>For more details, please speak to your reporting officer</p>
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
                        return res.send("status updated back to approved on user and reporting officer's table")
                        console.log('cancellation rejected email sent to user and covering')
                    })
                    .catch((error) => {
                        console.error("sendgrid error during cancellation rejected email: ", error)
                        console.log("err: ", error.response.body)
                    })
        })
        .catch(err => {
            return res.status(400).json(`reject leave unsuccessful: ${err}`)
            console.log("reject leave unsuccessful")
        })
    }

}

exports.getUserInfoByEmail = (req,res,next) => {
    const userEmail = req.params.id
    // console.log("req.params: ", req.params)
    User
        .findOne({email: userEmail})
        .then(user => {
            if(!user){
                throw new Error("did not find user record in db while updating user records") 
            }
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
                    staffLeave: user.staffLeave
                })
        })
        .catch( err => {
            // console.log("getUserInfoByEmail err:", err)
            return res.status(400).send("user not found")
        })
}

exports.postUpdateUser = (req,res,next) => {
    const userEmail = req.body.userEmail
    const newReportingEmail = req.body.newReportingEmail
    const newCoveringEmail = req.body.newCoveringEmail
    console.log("req.body: ", req.body)
    const date = new Date()
    // update reporting's email
    if (newReportingEmail) {
        User.findOneAndUpdate(
            {email: userEmail,},
            {$set: {"reportingEmail": newReportingEmail, "lastUpdatedOn": moment(date).format("YYYY/MM/DD H:mm:ss")}}
        )
        .then((result)=>{
            if(!result){
                throw new Error("did not find user record in db while updating user records") 
            }
            // console.log(result)
        })
        .catch((err)=> {
            // console.log("update reporting email error: ", err)
            return res.status(400).json(`update reporting email error: ${err}`)
        })
    }
    // update covering's email
    if (newCoveringEmail) {
        User.findOneAndUpdate(
            {email: userEmail,},
            {$set: {"coveringEmail": newCoveringEmail, "lastUpdatedOn": moment(date).format("YYYY/MM/DD H:mm:ss")}}
        )
        .then((result)=>{
            if(!result){
                throw new Error("did not find user record in db while updating user records") 
            }
            // console.log(result)
        })
        .catch((err)=> {
            // console.log("update covering email error: ", err)
            return res.status(400).json(`update covering email error: ${err}`)
        })
    }
    return res.status(200).send("update successful")
}

exports.getWorkDay = (req,res,next) => {
    const userEmail = req.params.id
    // console.log("req.params: ", req.params)
    Workday
        .findOne({entity:"chengdu"})
        .then(record => {
            if(!record){
                throw new Error("getWorkDay: did not find team calendar record in db") 
            }
            return res.status(200).json(
                {
                    holiday: record.holiday,
                    workday: record.workday
                })
        })
        .catch( err => console.log("getWorkDay err:", err))
}

exports.setWorkDay = (req,res,next) => {
    const workDaySelection = req.body.currentWorkdaySelection
    const holidaySelection = req.body.currentHolidaySelection

    const formattedWorkdaySelection = workDaySelection.map(date => moment(date).format("YYYY/MM/DD"))
    const formattedHolidaySelection = holidaySelection.map(date => moment(date).format("YYYY/MM/DD"))

    const entity = req.body.entity
    const initialWorkdaySelection = req.body.initialWorkdaySelection
    const initialHolidaySelection = req.body.initialHolidaySelection

    console.log(formattedWorkdaySelection.some(workday => formattedHolidaySelection.includes(workday)))
    if (formattedWorkdaySelection.some(workday => formattedHolidaySelection.includes(workday))){
        return res.status(400).send("workday and holiday cannot be the same day")
    }

    console.log("initialHolidaySelection: ", initialHolidaySelection, "holidaySelection: ",holidaySelection)
    console.log("removed work days: ", initialWorkdaySelection.filter(x => workDaySelection.includes(x) === false))
    // console.log("new work days added: ", workDaySelection.filter(x => initialWorkdaySelection.includes(x) === false))

    console.log("removed holidays: ", initialHolidaySelection.filter(x => holidaySelection.includes(x) === false))
    // console.log("new holidays added: ", holidaySelection.filter(x => initialHolidaySelection.includes(x) === false))

    // run through original array and check which values are not found, and remove them from team calendar
    const removedWorkdaySelection = initialWorkdaySelection.filter(x => workDaySelection.includes(x) === false) 
    const removedHolidaySelection = initialHolidaySelection.filter(x => holidaySelection.includes(x) === false) // run through original array and check which values are not found

    // add new values to team calendar
    const newWorkdaysAdded = workDaySelection.filter(x => initialWorkdaySelection.includes(x) === false)
    const newHolidaysAdded = holidaySelection.filter(x => initialHolidaySelection.includes(x) === false)

    // console.log("req.body: ", req.body)

    Workday.findOneAndUpdate(
        {entity: entity},
        {$set: {"workday": workDaySelection, "holiday": holidaySelection}},
        {upsert: true}
    )
    .then((result)=>{
        if(!result){
            throw new Error("did not find team calendar record in db") 
        } 
        // update team calendar

        // loop through new work days added and create new records before pushing to db
        const recordsOfNewWorkdaysAdded = []
        for(i=0; i<newWorkdaysAdded.length;i++){
            
            const teamCalendarRecord = new TeamCalendarRecord({
                start: new Date(newWorkdaysAdded[i]),
                end: new Date(newWorkdaysAdded[i]),
                type: "workday",
                startDateUnix: newWorkdaysAdded[i],
                endDateUnix: newWorkdaysAdded[i],
                staffName: "team calendar",
                title: `Workday 补休`,
                status: "approved"
            })
            recordsOfNewWorkdaysAdded.push(teamCalendarRecord)

            // broadcast each calendar record creation event to all users for dynamic calendar update
            io.getIO().emit('calendar', { action: 'create', calendarRecord: teamCalendarRecord})
        }

        console.log("recordsOfNewWorkdaysAdded: ", recordsOfNewWorkdaysAdded)

        // console.log("teamCalendarRecord:", teamCalendarRecord)

        return TeamCalendar.findOneAndUpdate(
            {team: "chengdu"},
            {
                $set: {"team": "chengdu"},
                $push: {"approvedLeave": {$each: recordsOfNewWorkdaysAdded}}
            },
            {upsert: true}
        )
    })
    .then((result)=>{
        if(!result){
            throw new Error("entity's team calendar record in db not found") 
        } 
        // update team calendar with newly added holidays

        // loop through new holidays added and create new records before pushing to db
        const recordsOfNewHolidaysAdded = []
        for(i=0; i<newHolidaysAdded.length;i++){

            const teamCalendarRecord = new TeamCalendarRecord({
                start: new Date(newHolidaysAdded[i]),
                end: new Date(newHolidaysAdded[i]),
                type: "holiday",
                startDateUnix: newHolidaysAdded[i],
                endDateUnix: newHolidaysAdded[i],
                staffName: "team calendar",
                title: `Holiday 公休`,
                status: "approved"
            })
            recordsOfNewHolidaysAdded.push(teamCalendarRecord)

            // broadcast each calendar record creation event to all users for dynamic calendar update
            io.getIO().emit('calendar', { action: 'create', calendarRecord: teamCalendarRecord})
        }
        console.log("recordsOfNewHolidaysAdded: ", recordsOfNewHolidaysAdded)
        // console.log("teamCalendarRecord:", teamCalendarRecord)

        return TeamCalendar.findOneAndUpdate(
            {team: "chengdu"},
            {
                $set: {"team": "chengdu"},
                $push: {"approvedLeave": {$each: recordsOfNewHolidaysAdded}}
            },
            {upsert: true}
        )
    })
    .then((result)=> {
        if(!result){
            throw new Error("did not find team calendar record in db when adding record") 
        } 
        if (removedWorkdaySelection.length){
            // delete removed work days from team calendar
            console.log("removedWorkdaySelection: ", removedWorkdaySelection)
            console.log("deleting removed work days from team calendar")
            for(i=0; i<removedWorkdaySelection.length;i++){
                TeamCalendar.updateOne(
                    {team: "chengdu"},
                    {$pull: {approvedLeave: {
                        startDateUnix: removedWorkdaySelection[i].toString(),
                        endDateUnix: removedWorkdaySelection[i].toString(),
                        staffName: "team calendar"
                    }}}
                )
                .then(()=>{
            
                    console.log("successfully deleted from calendar")
                })
                .catch((err)=> console.log(err))

                const deletedTeamCalendarRecord = 
                {
                    startDateUnix: removedWorkdaySelection[i].toString(), 
                    endDateUnix: removedWorkdaySelection[i].toString(), 
                    staffName: "team calendar"
                }
                // update client to delete cal record in real time
                io.getIO().emit('calendar', { action: 'delete', calendarRecord: deletedTeamCalendarRecord})
            }
            console.log("removedHolidaySelection: ", removedHolidaySelection)

        }

        if (removedHolidaySelection.length){
            // delete removed holidays from team calendar
            console.log("deleting removed holidays from team calendar")
            for(i=0; i<removedHolidaySelection.length;i++){
                console.log("i: ", i)
                TeamCalendar.updateOne(
                    {team: "chengdu"},
                    {$pull: {
                        approvedLeave: {startDateUnix: removedHolidaySelection[i].toString(),
                            endDateUnix: removedHolidaySelection[i].toString(),
                            staffName: "team calendar"
                        }
                    }}
                )
                .then(()=>{
                    console.log("successfully deleted from calendar")
                })
                .catch((err)=> console.log(err))

                const deletedTeamCalendarRecord = 
                {
                    startDateUnix: removedHolidaySelection[i].toString(), 
                    endDateUnix: removedHolidaySelection[i].toString(), 
                    staffName: "team calendar"
                }

                // update client to delete cal record in real time
                io.getIO().emit('calendar', { action: 'delete', calendarRecord: deletedTeamCalendarRecord})
            }
        }
        return res.send("set work day successful")
    })
    .catch((err)=> {
        return res.status(400).json("set work day unsuccessful")
        console.log(err)
    })
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
            return res.send("clear leave reminder email sent to user")
            console.log('clear leave reminder email sent to user')
        })
        .catch((error) => {
            console.error("clear leave reminder email sendgrid error: ", error)
        })
}