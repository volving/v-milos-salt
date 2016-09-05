'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var artistSchema = new Schema({
    name: String
});

var artworkSchema = new Schema({
    title: String,
    artist: artistSchema,
    coartist: artistSchema,
    category: String,
    times: String,
    size: String,
    onplatform: Boolean
});

var applicantSchema = new Schema({
    name: String,
    tel: String,
    idno: String,
    attachment: [String],
    photo: String
});

var docSchema = new Schema({
    preview: String,
    locator: String,
    details: [String]
});


var identifySchema = new Schema({
    applicants: [applicantSchema],
    docs: [docSchema]
});

var recordSchema = new Schema({
    details:[String],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

var verifySchema = new Schema({
    applicants: [applicantSchema],
    records: [recordSchema]
});


var identitySchema = new Schema({
    artwork: artworkSchema,
    identifys: [identifySchema],
    verifys: [verifySchema]
});


identitySchema.virtual('manager').get(function() {
    return this.contact.name;
});


module.exports = mongoose.model('Identity', identitySchema);