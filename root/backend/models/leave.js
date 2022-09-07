const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const leaveSchema = new Schema({
    annual: {
        type: Object,
        required: true
    },
    compassionate: {
        type: Object,
        required: true
    },
    medical: {
        type: Object,
        required: true
    },
    hospitalisation: {
        type: Object,
        required: true
    },
    marriage: {
        type: Object,
        required: true
    },
    maternity: {
        type: Object,
        required: true
    },
    miscarriage: {
        type: Object,
        required: true
    },
    natal: {
        type: Object,
        required: true
    },
    paternity: {
        type: Object,
        required: true
    },
    unpaid: {
        type: Object,
        required: true
    },
    childcare: {
        type: Object,
        required: true
    },
    womenDay: {
        type: Object,
        required: true
    },
   
})

module.exports = mongoose.model('Leave', leaveSchema)