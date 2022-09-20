const User = require('../models/user')
var moment = require('moment');
require('moment-weekday-calc');

const sendgridMail = require('@sendgrid/mail');
const leaveHistory = require('../models/leaveHistory');
const { default: mongoose } = require('mongoose');

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
                    // ro: user.ro,
                    reportingEmail: user.reportingEmail,
                    // co: user.co,
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

exports.getNumOfDaysApplied = (req,res,next) => {
    const startDate = req.body.startDate
    const endDate = req.body.endDate

    if(startDate < endDate){
        const numOfDays = moment().weekdayCalc({  
            rangeStart: moment(startDate).format("DD MMM YYYY"),  
            rangeEnd: moment(endDate).format("DD MMM YYYY"),  
            weekdays: [1,2,3,4,5],  
            exclusions: ['12 Sep 2022','7 Apr 2015'],
            inclusions: ['10 Apr 2015']
        })
        console.log(moment(startDate).format("DD MMM YYYY"), moment(endDate).format("DD MMM YYYY"), numOfDays)
        res.status(200).send({numOfDaysApplied: numOfDays})
    }
    else{
        res.status(400).send("start date is bigger than end date")
    }
}

exports.postLeaveApplicationForm = (req,res,next) => {
        const userId = req.body.userId
        const userEmail = req.body.userEmail
        const coveringEmail = req.body.coveringEmail
        const reportingEmail = req.body.reportingEmail
        const remarks = req.body.remarks
        const leaveType = req.body.leaveType
        const numOfDaysTaken = req.body.numOfDaysTaken
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
                submittedOn: dateOfApplication,
                quotaUsed: numOfDaysTaken,
                coveringEmail: coveringEmail,
                reportingEmail: reportingEmail,
                remarks: remarks,
                status: "pending"
            })
            console.log("leaveHistoryData: ",leaveHistoryData)
            const filterTargetLeaveType = user.leave.filter(leave => leaveType === leave.name)
            const targetLeaveName = filterTargetLeaveType[0].name

            return User.updateOne( 
                    {_id: userId, "leave.name": targetLeaveName}, 
                    {$inc: {"leave.$.pending": numOfDaysTaken},})
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
                submittedOn: dateOfApplication,
                quotaUsed: numOfDaysTaken,
                remarks: remarks,
                status: "pending"
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
    const leaveHistory = req.body.targetLeaveHistory
    const leaveType = leaveHistory[0].leaveType
    const quotaUsed = leaveHistory[0].quotaUsed
    const timePeriod = leaveHistory[0].timePeriod
    const startDateUnix = leaveHistory[0].startDateUnix
    const submittedOn = leaveHistory[0].submittedOn
    const leaveStatus = leaveHistory[0].status

    const leaveRequestId = leaveHistory[0]._id
    const leaveRequestTimestamp = leaveHistory[0].timestamp

    if (leaveStatus === "approved"){
        User
            .findOneAndUpdate({_id: userId, "leave.name":leaveType}, 
                { // update pending and entitlement count after cancellation
                    $inc: {"leave.$.used": -quotaUsed},
                }
            )
            .then(result => {
                console.log(result.leave[0])
            })
            .catch(err => console.log("pending and entitlement count rollback err:", err))
    }
    else{
        User
            .findOneAndUpdate({_id: userId, "leave.name":leaveType}, 
                { // update pending and entitlement count after cancellation
                    $inc: {"leave.$.pending": -quotaUsed},
                }
            )
            .then(result => {
                console.log(result.leave[0])
            })
            .catch(err => console.log("pending and entitlement count rollback err:", err))
    }

    User
        .findOneAndUpdate( // update user's leave status
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
        .then(() => {
            console.log("updated user's leave status to cancelled")
        })
        .catch(err => console.log("update leaveHistory status err: ", err))

    User
        .findOneAndUpdate( // update reporting's leave status
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
            }
        )
        .then((result) => {
            // console.log(result)
            res.send("updated reporting's leave status to cancelled")
        })
        .catch(err => console.log("update staffLeave status err: ", err))

}