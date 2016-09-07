'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var identitySchema = new Schema({
    sid: String,

    status: String, //creating/'', processing, available, disabled
    artwork: {
        type: Schema.Types.ObjectId,
        ref: 'Artwork'
    },
    identifys: [{
        type: Schema.Types.ObjectId,
        ref: 'Identify'
    }],
    verifys: [{
        type: Schema.Types.ObjectId,
        ref: 'Verify'
    }],
    creater: {
        type: Schema.Types.ObjectId,
        ref: 'Applicant',
        default: undefined
    },
    ts: {
        type: Date,
        default: Date.now
    }
});


// identitySchema.virtual('manager').get(function() {
//     return this.contact.name;
// });


module.exports = mongoose.model('Identity', identitySchema);
