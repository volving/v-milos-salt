'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var docSchema = new Schema({
    fullview: String,
    preview: String,
    magifyview: String,
    zoom: String,
    remarks: String,
    locator: {
        type: String,
        default: ''
    }

});


module.exports = mongoose.model('Doc', docSchema);
