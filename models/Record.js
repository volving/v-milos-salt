'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recordSchema = new Schema({
    details: [String],
    ts: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Record', recordSchema);
