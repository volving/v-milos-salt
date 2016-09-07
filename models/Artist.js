'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var artistSchema = new Schema({
    name: String,
    title: String,
    dob: String,
    region: String
});

module.exports = mongoose.model('Artist', artistSchema);
