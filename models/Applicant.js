'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applicantSchema = new Schema({
    name: String,
    tel: String,
    idno: String,
    attachments: [String],
    photo: [String]
});

module.exports = mongoose.model('Applicant', applicantSchema);
