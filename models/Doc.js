'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var docSchema = new Schema({
    fullview: String,
    preview: String,
    magnifyview: String,
    zoom: String,
    remarks: String,
    locator: {
        type: String,
        default: ''
    },
    ts: {
        type: Date,
        default: Date.now
    }

});


module.exports = mongoose.model('Doc', docSchema);
