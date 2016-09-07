'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var verifySchema = new Schema({
    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'Applicant'
    },
    records: [{
        type: Schema.Types.ObjectId,
        ref: 'Record'
    }],
    ts: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Verify', verifySchema);
