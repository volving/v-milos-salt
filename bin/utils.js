'use strict';

var mongoose = require('mongoose');
var crypto = require('crypto');

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
    },
    md5it: function (origin, type) {
        var md5hash = crypto.createHash('md5');
        md5hash.update(origin);
        return md5hash.digest(type || 'hex');
    },
    getFullDate: function () {
        function digit2(d) {
            return d > 10 ? '' + d : '0' + d;
        }
        var d = new Date();
        return d.getFullYear() + digit2(d.getMonth() + 1) + digit2(d.getDay()) + digit2(d.getHours()) + digit2(d.getMinutes()) + digit2(d.getSeconds());
    },
    base64it: function(origin){
        var buf = new Buffer(origin);
        if (buf.length > 0) {
            return buf.toString('base64');
        }
        return '';
    }
};
