const User = require('../models/user')
var moment = require('moment');
require('moment-weekday-calc');


const sendgridMail = require('@sendgrid/mail')

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
        const startDate = moment(req.body.startDate).format("DD MMM YYYY")
        const endDate = moment(req.body.endDate).format("DD MMM YYYY")

    // find userid from mongodb
    User
        .findOne({_id: userId})
        .then(user => {
            if (!user) return res.status(400).send("user ID did not match db")

            const filterTargetLeaveType = user.leave.filter(leave => leaveType === leave.name)
            const targetLeaveName = filterTargetLeaveType[0].name

            User
            .updateOne(
                {_id: userId, "leave.name": targetLeaveName}, 
                {$inc: {"leave.$.entitlement": -numOfDaysTaken}})
            .then((result) => {
                // console.log(result)
                res.status(200).send("leave application successful")

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
                        res.status(200).send("email sent to user and covering")
                        console.log('email sent to user and covering')
                    })
                    .catch((error) => {
                        console.error("sendgrid error when sending to user/covering: ", error)
                    })

                    const emailToReporting = {
                    to: reportingEmail,
                    from: 'mfachengdu@gmail.com', // Change to your verified sender
                    subject: `Leave Application by ${userEmail} - ${startDate} to ${endDate} `,
                    html: `
                        <div>
                            <p>Hi ${reportingEmail}, </p> 
                            <p>${userEmail} would like to apply for ${numOfDaysTaken} days of <strong>${leaveType}</strong> from ${startDate} to ${endDate}</p>
                            <p>Log in to XXX to approve or reject this request. Thank you. </p>
                        </div>
                    `
                    }
                    sendgridMail
                    .send(emailToReporting) // email to inform reporting of user's leave request
                    .then(() => {
                        res.status(200).send("email sent to reporting")
                        console.log('email sent to reporting')
                    })
                    .catch((error) => {
                        console.error("sendgrid error when sending to reporting: ", error)
                    })
                
                // create leave history details and push into User

            })
            .catch(err => console.log("postLeaveApplicationForm err: ", err))
            
            console.log("leave application form data received")
        })



}