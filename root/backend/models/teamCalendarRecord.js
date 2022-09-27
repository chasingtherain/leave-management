const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const teamCalendarRecordSchema = new Schema({
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    },
    staffName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('TeamCalendarRecord', teamCalendarRecordSchema)