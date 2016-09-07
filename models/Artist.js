'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var artistSchema = new Schema({
    name: String,
    title: String,
    called: [String],
    dob: String,
    region: String,
    remarks: String,
    onplatform: Boolean,
    url: String,
    ts: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Artist', artistSchema);
