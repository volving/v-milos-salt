'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applicantSchema = new Schema({
    name: String,
    idno: String,
    tel: String,
    email: String,
    attachments: [String],
    photos: [String],
    ts: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Applicant', applicantSchema);
