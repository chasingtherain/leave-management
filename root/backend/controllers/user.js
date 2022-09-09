const User = require('../models/user')
var moment = require('moment')
require('moment-weekday-calc');

exports.getAllUser = (req,res,next) => {
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
    const startDate = moment.unix(1318781876).format("DD-MMM-YYYY");
    const endDate = moment.unix(1319781876).format("DD-MMM-YYYY");

    console.log("day: ", day)

    const numOfDays = moment().weekdayCalc({  
        rangeStart: startDate,  
        rangeEnd: endDate,  
        weekdays: [1,2,3,4,5],  
        exclusions: ['6 Apr 2015','7 Apr 2015'],
        inclusions: ['10 Apr 2015']
      })
    console.log(numOfDays);
    res.status(200).send({numOfDays: numOfDays})
}