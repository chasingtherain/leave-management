const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const leaveHistorySchema = new Schema({
    leaveType: {
        type: String,
        required: true
    },
    timePeriod: {
        type: String,
        required: true
    },
    startDateUnix:{
        type: String,
        required: true
    },
    timestamp:{
        type: Date,
        default: Date.now
    },
    numOfDaysTaken: {
        type: String,
        required: true
    },
    submittedOn: {
        type: String,
        required: true
    },
    quotaUsed: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    }
   
})

module.exports = mongoose.model('LeaveHistory', leaveHistorySchema)