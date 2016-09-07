'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var identifySchema = new Schema({
    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'Applicant'
    },
    docs: [{
        type: Schema.Types.ObjectId,
        ref: 'Doc'
    }],
    artwork: {
        type: Schema.Types.ObjectId,
        ref: 'Artwork'
    },
    sid: String,
    ts: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Identify', identifySchema);
