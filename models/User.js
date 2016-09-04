'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var conf = require('../conf/secret');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    nickname: String,
    fullname: String,
    gender: String,
    region: String,
    email: String,
    mobile: String,
    idno: String,
    attachment: String,
    remarks: String,
    usertype: [String],
    register_ts: {
        type: Date,
        default: Date.now
    }
});


var noop = function() {};

var saltFactor = conf.cipher.salt_factor || 10;
userSchema.pre('save', function(done) {
    var user = this;
    if (!user.isModified('password')) {
        return done();
    }
    bcrypt.genSalt(saltFactor, function(err, salt) {
        if (err) {
            return done(err);
        }
        bcrypt.hash(user.password, salt, noop, function(err, hashed) {
            if (err) {
                return done(err);
            }
            user.password = hashed;
            return done();
        });
    });
});


userSchema.methods.checkPassword = function(guess, done){
    bcrypt.compare(guess, this.password, function(err, isMatch){
        done(err, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);
