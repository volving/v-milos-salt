'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var verifySchema = new Schema({
    applicants: [{
        type: Schema.Types.ObjectId,
        ref: 'Applicant'
    }],
    records: [{
        type: Schema.Types.ObjectId,
        ref: 'Record'
    }]
});


module.exports = mongoose.model('Verify', verifySchema);
