const User = require('../models/user')
var moment = require('moment');
require('moment-weekday-calc');

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
    // data sent:
        // userId: currentUser._id,
        // userEmail:currentUser.email,
        // coveringEmail: currentUser.coveringEmail,
        // reportingEmail: currentUser.reportingEmail,
        // remarks: remarks,
        // leaveType: currentLeaveSelection,
        // numOfDaysTaken: numOfDaysApplied

    // find userid from mongodb

    User
        .findOne({_id: req.body.userId})
        .then(user => {
            if (!user) return res.status(400).send("user ID did not match db")

            // const leaveCount = -req.body.numOfDaysTaken
            const filterTargetLeaveType = user.leave.filter(leave => req.body.leaveType === leave.name)
            const targetLeaveName = filterTargetLeaveType[0].name

            User
            .updateOne(
                {_id: req.body.userId, "leave.name": targetLeaveName}, 
                {$inc: {"leave.$.entitlement": -req.body.numOfDaysTaken}})
            .then((result) => {
                // console.log(result)
                res.status(200).send("leave application successful")
            })
            .catch(err => console.log(err))
            
            console.log("leave application form data received")
        })
    // update mongodb with latest leave
    // send email to user, covering and reporting
    // send status back to FE
}