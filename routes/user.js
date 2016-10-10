'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/', function (req, res, next) { //jshint ignore: line
    var id = req.session && req.session.passport && req.session.passport.user;
    if (!id) {
        req.flash('warning', ['请先登录']);
        return res.redirect('/login');
    }
    return res.render('user/profile');
});


router.post('/save', function (req, res, next) { //jshint ignore:line
    var warning = [];
    var f = req.body;
    var username = f.username;
    var id = req.session && req.session.passport && req.session.passport.user;
    if (!id) {
        warning.push('请先登录');
    }
    if (!username) {
        warning.push('"用户名"是必填项');
    }
    if (warning.length > 0) {
        return res.redirect('/');
    }
    User.update({_id: id}, {$set: {
        username: username,
        nickname: f.nickname,
        fullname: f.fullname,
        gender: f.gender,
        region: f.region,
        email: f.email,
        mobile: f.mobile,
        idno: f.idno,
        // attachments: f.attachments,
        remarks: f.remarks,
        lastmodify: Date.now()
    }}).exec(function(err, user){
        if (err) {
            next(err);
        }
        if (user) {
            req.flash('success', ['数据已更新']);
        }
        return res.redirect('/user');
    });
});
// router.get('', function(req, res, next) { //jshint ignore: line

// });

module.exports = router;
