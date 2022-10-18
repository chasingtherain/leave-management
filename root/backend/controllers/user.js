const User = require('../models/user')
const Workday = require('../models/workday')

var moment = require('moment');
require('moment-weekday-calc');

const sendgridMail = require('@sendgrid/mail');
const leaveHistory = require('../models/leaveHistory');
const TeamCalendar = require('../models/teamCalendar')

const date = new Date()

exports.getUser = (req,res,next) => {
    const userId = req.params.id
    // console.log("req.params: ", req.params)
    User
        .findOne({_id: userId})
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
        .catch( err =>console.log("getUser err:", err))
}

exports.getAllUsers = (req,res,next) => {
    User.find((err, docs) => {
        if (!err) {
            // console.log(docs)
            res.status(200).send(docs)   
        } else {
            console.log('Failed to retrieve the Course List: ' + err);
        }
    });
}

exports.getTeamLeaveRecords = (req,res,next) => {

    TeamCalendar
        .findOne({entity: "chengdu"},)
        .then(result => 
            {
                // update names to big calendar format
                // console.log("team record: ", result)
                const newTeamLeave = result.approvedLeave.map(({
                _id: id,
                ...rest
              }) => ({
                id,
                ...rest
              }));
            
            // console.log(newTeamLeave)
            
            res.send(newTeamLeave)
            })
        .catch(err => console.log(err))
}

exports.getNumOfDaysApplied = (req,res,next) => {
    const startDate = req.body.startDate
    const endDate = req.body.endDate


    Workday
        .findOne({entity: "chengdu"})
        .then(result => {
            // console.log(result)
            const holidaySelection = result.holiday.map(timestamp => moment(timestamp).format("DD MMM YYYY"))
            const workdaySelection = result.workday.map(timestamp => moment(timestamp).format("DD MMM YYYY"))

            if(startDate < endDate){
                const numOfDays = moment().weekdayCalc({  
                    rangeStart: moment(startDate).format("DD MMM YYYY"),  
                    rangeEnd: moment(endDate).format("DD MMM YYYY"),  
                    weekdays: [1,2,3,4,5],  
                    exclusions: holidaySelection, // do not count these dates as business days
                    inclusions: workdaySelection // count as business days
                })
                console.log(moment(startDate).format("DD MMM YYYY"), moment(endDate).format("DD MMM YYYY"), numOfDays)
                res.status(200).send({numOfDaysApplied: numOfDays})
            }
            else{
                res.status(400).send("start date is bigger than end date")
            }
        })
        .catch(err => console.log(err))
}

exports.postLeaveApplicationForm = (req,res,next) => {
        const userId = req.body.userId
        const userEmail = req.body.userEmail
        const coveringEmail = req.body.coveringEmail
        const reportingEmail = req.body.reportingEmail
        const staffName = req.body.staffName
        const file = req.body.file
        const remarks = req.body.remarks
        const leaveType = req.body.leaveType
        const numOfDaysTaken = req.body.numOfDaysTaken
        const leaveClassification = req.body.leaveClassification
        const dateOfApplication = moment(req.body.dateOfApplication).format("DD MMM YYYY")
        const startDate = moment(req.body.startDate).format("DD MMM YYYY")
        const endDate = moment(req.body.endDate).format("DD MMM YYYY")
        console.log(req.body)
    // find userid from mongodb
    User
        .findOne({_id: userId})
        .then(user => {
            if (!user) return res.status(400).send("user ID did not match db")

            const leaveHistoryData = new leaveHistory({
                leaveType: leaveType,
                timePeriod: `${startDate} - ${endDate}`,
                startDateUnix: req.body.startDate,
                endDateUnix: req.body.endDate,
                staffName: req.body.staffName,
                submittedOn: dateOfApplication,
                quotaUsed: numOfDaysTaken,
                coveringEmail: coveringEmail,
                reportingEmail: reportingEmail,
                leaveClassification: leaveClassification,
                remarks: remarks,
                status: "pending",
                year: date.getFullYear()
            })
            console.log("leaveHistoryData: ",leaveHistoryData)
            const filterTargetLeaveType = user.leave.filter(leave => leaveType === leave.name)

            // if user selected roll over leave, leave type will be "Annual Leave 年假"
            const targetLeaveName = (leaveType.includes("年额带过")) ? "Annual Leave 年假" : filterTargetLeaveType[0].name

            return User.updateOne( 
                    {_id: userId, "leave.name": targetLeaveName}, 
                    {
                        $inc: {"leave.$.pending": numOfDaysTaken},
                    })
            .then((result) => {
                return User.updateOne(
                    {_id: userId}, 
                    {$push: {"leaveHistory": leaveHistoryData}}) // create leave history
            })
        })
        .then((result) => {
            // create subordinate leave for reporting officer

            const staffLeaveData = {
                staffEmail: userEmail,
                coveringEmail: coveringEmail,
                reportingEmail: reportingEmail,
                leaveType: leaveType,
                timePeriod: `${startDate} - ${endDate}`,
                startDateUnix: req.body.startDate,
                endDateUnix: req.body.endDate,
                staffName: req.body.staffName,
                submittedOn: dateOfApplication,
                quotaUsed: numOfDaysTaken,
                leaveClassification: leaveClassification,
                remarks: remarks,
                status: "pending",
                year: date.getFullYear()
            }

            User
                .findOne({email: reportingEmail})
                .then((user)=>{
                    // if (!user) return res.status(400).send("reporting officer email not found in db")
                    if (!user) return console.log("reporting officer email not found in db")
                    User.updateOne(
                        {email: reportingEmail},
                        {$push: {"staffLeave": staffLeaveData}}
                    )
                    .then((result)=>{
                        // console.log(result)
                    })
                    .catch(err => console.log("subordinate leave err: ", err))    
                })
            // send email to user, covering
            sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)

            const emailToUserAndCovering = {
            to: userEmail,
            from: 'mfachengdu@gmail.com', // Change to your verified sender
            cc: coveringEmail,
            subject: `Leave Application from ${startDate} to ${endDate}`,
            html: `
                <div>
                    <p>Hi ${userEmail}, you applied ${numOfDaysTaken} days of <strong>${leaveType}</strong> from ${startDate} to ${endDate}</p> 
                    <p>You will receive an email confirmation once your reporting officer reviews the request, thank you.</p>
                </div>
                <div>
                    <p>您好 ${userEmail}，您在${startDate}至${endDate}申请了${numOfDaysTaken}天<strong>${leaveType}</strong></p> 
                    <p>一旦您的主管审核，您将收到一封邮件，谢谢。</p>
                </div>
            `
            }
            sendgridMail
                .send(emailToUserAndCovering) // email to inform user and covering of leave request
                .then(() => {
                    // res.status(200).send("email sent to user and covering")
                    console.log('email sent to user and covering')
                })
                .catch((error) => {
                    console.error("sendgrid error when sending to user/covering: ", error)
                    console.log("err: ", error.response.body)
                })

        const emailToReporting = {
        to: reportingEmail,
        from: 'mfachengdu@gmail.com', // Change to your verified sender
        subject: `Leave Application by ${userEmail} - ${startDate} to ${endDate} `,
        html: `
            <div>
                <p>Hi ${reportingEmail}, </p> 
                <p>${userEmail} would like to apply for ${numOfDaysTaken} days of <strong>${leaveType}</strong> from ${startDate} to ${endDate}</p>
                <p>Log in to ${process.env.REACT_APP_FRONTENDURL} to approve or reject this request. Thank you. </p>
            </div>
        `
        }
        sendgridMail
            .send(emailToReporting) // email to inform reporting of user's leave request
            .then(() => {
                console.log('email sent to reporting')
            })
            .catch((error) => {
                console.error("sendgrid error when sending to reporting: ", error)
            })

        res.status(200).send("leave application successful, email sent to user, covering and reporting officer") 
        // create leave history details and push into User
        console.log("leave application successful")
    })
    .catch(err => console.log("postLeaveApplicationForm err: ", err))
}

exports.cancelLeaveRequest = (req,res) => {
    const userId = req.body.userId
    const reportingEmail = req.body.reportingEmail
    const userEmail = req.body.userEmail
    const leaveHistory = req.body.targetLeaveHistory
    const staffName = leaveHistory[0].staffName
    const leaveType = leaveHistory[0].leaveType
    const quotaUsed = leaveHistory[0].quotaUsed
    const timePeriod = leaveHistory[0].timePeriod
    const submittedOn = leaveHistory[0].submittedOn
    const leaveStatus = leaveHistory[0].status
    const startDate = new Date(+(leaveHistory[0].startDateUnix))
    const endDate = new Date(+(leaveHistory[0].endDateUnix))
    const startDateUnix = leaveHistory[0].startDateUnix
    const endDateUnix = leaveHistory[0].endDateUnix

    console.log("cancelLeaveRequest req.body: ", req.body)

    const currentDateUnix = new Date().getTime()

    if (leaveStatus === "approved" && currentDateUnix >= startDate) {
        // scenario: current year's leave was approved and consumed but staff cancelled it (i.e. applied date has passed)
        // requires RO's approval to cancel past leave

        // update reporting's leave status to pending cancellation
        User.findOneAndUpdate( 
            {
                email: reportingEmail, 
                "staffLeave.leaveType": leaveType,
                "staffLeave.staffName": staffName,
                "staffLeave.timePeriod": timePeriod,
                "staffLeave.startDateUnix": +startDateUnix,
                "staffLeave.submittedOn": submittedOn,
                "staffLeave.quotaUsed": quotaUsed,
                "staffLeave.status": leaveStatus,
            },
            {
                $set: {"staffLeave.$.status": "pending cancellation" }
            })
        .then((result)=>{
            // console.log("RO's record: ", result.staffLeave.length)
            // update staff's leave status to pending cancellation

            return User.findOneAndUpdate( 
                {
                    email: userEmail, 
                    "leaveHistory.leaveType": leaveType,
                    "leaveHistory.timePeriod": timePeriod,
                    "leaveHistory.quotaUsed": quotaUsed,
                    "leaveHistory.status": leaveStatus,
                    "leaveHistory.submittedOn": submittedOn,
                },
                {
                    $set: {"leaveHistory.$.status": "pending cancellation" }
                }
            )
        })
        .then((result)=> {
            // console.log("user's leave record: ", result)
            // send cancellation approval email to reporting 
            const cancellationEmailToReporting = {
                to: reportingEmail,
                from: 'mfachengdu@gmail.com',
                subject: `Cancellation of approved leave by ${userEmail} - ${startDate} to ${endDate} `,
                html: `
                    <div>
                        <p>Hi ${reportingEmail}, </p> 
                        <p>${userEmail} would like to cancel an approved leave request from ${startDate} to ${endDate}</p>
                        <p>Log in to ${process.env.REACT_APP_FRONTENDURL} to approve or reject this cancellation request. Thank you. </p>
                    </div>
                `
            }
            sendgridMail
                .send(cancellationEmailToReporting) // email to inform reporting of user's leave request
                .then(() => {
                    console.log('cancellation email for approved leave sent to RO')
                    res.send("updated leave status to pending cancellation")
                })
                .catch((error) => {
                    console.error("sendgrid error when sending cancellation email for approved leave to RO: ", error)
                })
        })
        .catch(err => console.log("pending cancellation err:", err))
    }

    else if(leaveStatus === "approved" && currentDateUnix < startDate){
        // scenario: leave was approved but not consumed yet (i.e. date has not passed)
        // do not require RO to approve cancellation

        User
            .findOneAndUpdate({_id: userId, "leave.name":leaveType}, 
                { // subtract used count after cancellation
                    $inc: {"leave.$.used": -quotaUsed}
                }
            )
            .then(result => {
                // update team leave record to cancelled
                console.log("deleting from team calendar")
                TeamCalendar.updateOne(
                    {team: "chengdu"},
                    {$pull: {approvedLeave: {start: startDate.toString(),end: endDate.toString()}}}
                )
                .catch(err => console.log("err deleting team calendar record",err))
            })
            .then(()=>{
                // update user's leave history status
                return User.findOneAndUpdate( 
                    {
                        _id: userId, 
                        "leaveHistory.startDateUnix": startDateUnix,
                        "leaveHistory.leaveType": leaveType,
                        "leaveHistory.timePeriod": timePeriod,
                        "leaveHistory.quotaUsed": quotaUsed,
                        "leaveHistory.status": leaveStatus,
                        "leaveHistory.submittedOn": submittedOn,
                    },
                    {
                        $set: {"leaveHistory.$.status": "cancelled" }
                    }
                )
            })
            .then(() => {
                // update reporting's leave status
                return User.findOneAndUpdate( 
                    {
                        email: reportingEmail, 
                        "staffLeave.leaveType": leaveType,
                        "staffLeave.timePeriod": timePeriod,
                        "staffLeave.startDateUnix": +startDateUnix,
                        "staffLeave.submittedOn": submittedOn,
                        "staffLeave.quotaUsed": quotaUsed,
                        "staffLeave.status": leaveStatus,
                    },
                    {
                        $set: {"staffLeave.$.status": "cancelled" }
                    })
            })
            .then(()=>{
                console.log("updated leave status to cancelled for both staff and RO")
                res.send("updated leave status to cancelled for both staff and RO")
            })
            .catch(err => console.log("subtract used count after cancellation err:", err))
    }
    else{
        // scenario: leave was not approved and not consumed yet (i.e. date has not passed)
        // do not require RO approval to cancel leave

        User
            .findOneAndUpdate({_id: userId, "leave.name":leaveType}, 
                { // update pending count after cancellation
                    $inc: {"leave.$.pending": -quotaUsed},
                }
            )
            .then(()=>{
                return User.findOneAndUpdate( 
                    {
                        _id: userId, 
                        "leaveHistory.startDateUnix": startDateUnix,
                        "leaveHistory.leaveType": leaveType,
                        "leaveHistory.timePeriod": timePeriod,
                        "leaveHistory.quotaUsed": quotaUsed,
                        "leaveHistory.status": leaveStatus,
                        "leaveHistory.submittedOn": submittedOn,
                    },
                    {
                        $set: {"leaveHistory.$.status": "cancelled" }
                    }
                )
            })
            .then(() => {
                // update reporting's leave status
                return User.findOneAndUpdate( 
                    {
                        email: reportingEmail, 
                        "staffLeave.leaveType": leaveType,
                        "staffLeave.timePeriod": timePeriod,
                        "staffLeave.startDateUnix": +startDateUnix,
                        "staffLeave.submittedOn": submittedOn,
                        "staffLeave.quotaUsed": quotaUsed,
                        "staffLeave.status": leaveStatus,
                    },
                    {
                        $set: {"staffLeave.$.status": "cancelled" }
                    })
            })
            .then((result)=> {
                console.log("updated leave status to cancelled for both staff and RO")
                res.send("updated leave status to cancelled for both staff and RO")
            })
            .catch(err => console.log("pending and entitlement count rollback err:", err))
    }
}