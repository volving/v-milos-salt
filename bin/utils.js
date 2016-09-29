'use strict';

var mongoose = require('mongoose');

module.exports = {
    getMongoId: function getMongoId(str) {
        return mongoose.Types.ObjectId(str);
    },
    formatQuery: function (obj) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
            return str.join('&');
        }
    }
};
