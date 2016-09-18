'use strict';

var mongoose = require('mongoose');

module.exports = {
    getMongoId: function getMongoId(str) {
        return mongoose.Types.ObjectId(str);
    }
};
