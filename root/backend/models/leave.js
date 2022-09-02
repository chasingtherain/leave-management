const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const leaveSchema = new Schema({
    annualLeave: {
        type: Number,
        required: true
    },
    sickLeave: {
        type: Number,
        required: true
    },
    hospitalisationLeave: {
        type: Number,
        required: true
    },
    maternityLeave: {
        type: Number,
        required: true
    },
    marriageLeave: {
        type: Number,
        required: true
    },
    noPayLeave: {
        type: Number,
        required: true
    },
    childcareLeave: {
        type: Number,
        required: true
    },
    others: {
        type: Number,
    },
   
})

module.exports = mongoose.model('Leave', leaveSchema)