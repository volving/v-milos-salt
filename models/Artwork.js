'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var artworkSchema = new Schema({
    title: String,
    artist: {
        type: Schema.Types.ObjectId,
        ref: 'Artist'
    },
    coartist: {
        type: Schema.Types.ObjectId,
        ref: 'Artist'
    },
    category: String,
    times: String,
    size: String,
    onplatform: Boolean
});

module.exports = mongoose.model('Artwork', artworkSchema);
