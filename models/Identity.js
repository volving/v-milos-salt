'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var identitySchema = new Schema({
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
    availability: String //creating/'', processing, available, disabled
});


// identitySchema.virtual('manager').get(function() {
//     return this.contact.name;
// });


module.exports = mongoose.model('Identity', identitySchema);
