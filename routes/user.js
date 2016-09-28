'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/', function (req, res, next) { //jshint ignore: line
    var query = req.query;
    User.findOne({
        _id: query.id
    }).exec(function (err, user) {
        if (err) {
            req.flash('warning', '该用户不存在!');
            return res.redirect('/');
        }

        return res.render('user/profile', {
            user: user
        });
    });
});

/* GET users listing. */
router.get('/save', function (req, res, next) { //jshint ignore:line
    var query = req.query;

    User.findOne({
        _id: id
    }).exec(function (err, user) {
        if (err) {
            req.flash('warning', '该用户不存在!');
            return res.redirect('/');
        }

        return res.render('user/profile', {
            user: user
        });
    });
});

module.exports = router;
