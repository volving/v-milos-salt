'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var agentSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: String,
    contact: {
        name: String,
        tel: String
    },
    tel: String,
    email: String,
    business_hours: String,
    register_ts: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true }
});


agentSchema.virtual('manager').get(function() {
    return this.contact.name;
});


module.exports = mongoose.model('Agent', agentSchema);
