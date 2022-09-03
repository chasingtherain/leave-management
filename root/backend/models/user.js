const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdOn: {
        type: String,
        required: true
    },
    lastUpdatedOn: {
        type: String,
        required: true
    },
    ro: {
        type: String,
        required: true
    },
    reportingEmail: {
        type: String,
        required: true
    },
    co: {
        type: String,
        required: true
    },
    coveringEmail: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
    },
    // leaveLeft: {
    //     type: Schema.Types,
    //     ref: 'User',
    // }
})

module.exports = mongoose.model('User', userSchema)