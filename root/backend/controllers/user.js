const User = require('../models/user')
var moment = require('moment')
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

    console.log(moment(startDate).format("DD MMM YYYY"), moment(endDate).format("DD MMM YYYY"))

    const numOfDays = moment().weekdayCalc({  
        rangeStart: moment(startDate).format("DD MMM YYYY"),  
        rangeEnd: moment(endDate).format("DD MMM YYYY"),  
        weekdays: [1,2,3,4,5],  
        exclusions: ['12 Sep 2022','7 Apr 2015'],
        inclusions: ['10 Apr 2015']
      })
    res.status(200).send({numOfDaysApplied: numOfDays})
}