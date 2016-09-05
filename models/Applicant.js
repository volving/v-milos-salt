'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applicantSchema = new Schema({
    name: String,
    tel: String,
    idno: String,
    attachment: [String],
    photo: [String]
});

module.exports = mongoose.model('Applicant', applicantSchema);
