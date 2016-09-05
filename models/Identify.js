'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var identifySchema = new Schema({
    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'Applicant'
    },
    artwork: {
        type: Schema.Types.ObjectId,
        ref: 'Artwork'
    },
    docs: [{
        type: Schema.Types.ObjectId,
        ref: 'Doc'
    }]
});

module.exports = mongoose.model('Identify', identifySchema);
