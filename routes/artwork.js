'use strict';

var express = require('express');
var router = express.Router();
var Artwork = require('../models/Artwork');
var utils = require('../bin/utils');

var multer = require('multer');
var uploader = multer({
    dest: './public/uploads'
});


router.get('/', function (req, res, next) { //jshint ignore: line
    var warning = [];
    Artwork.find({}).populate('artist coartist').exec(function (err, list) {
        if (err) {
            return next(err);
        }
        if (!list) {
            warning.push('尚未查到对应记录');
            req.flash('warning', warning);
        }
        return res.render('artwork/list', {
            artworks: list
        });
    });
});

router.use(function (req, res, next) {
    var warning = [];
    var user = req.session && req.session.passport && req.session.passport.user;
    if (!user) {
        warning.push('请先登录');
    }
    if (warning.length > 0) {
        req.flash('warning', warning);
        return res.redirect('/login');
    }
    next();
});

router.get('/edit', function (req, res, next) { //jshint ignore: line
    var warning = [];
    var q = req.query;
    var id = q._id;
    if (!id) {
        warning.push('url有误');
    }
    if (warning.length > 0) {
        req.flash('warning', warning);
        return res.redirect('/artwork');
    }
    Artwork.findOne({ _id: id }).populate('artist coartist').exec(function (err, item) {
        if (err) {
            warning.push('查找数据库出错');
            req.flash('warning', warning);
            return res.redirect('/artwork');
        }
        if (!item) {
            warning.push('尚未查到对应记录');
            req.flash('warning', warning);
            return res.redirect('/artwork');
        }
        return res.render('artwork/edit', {
            artwork: item
        });
    });
});


router.post('/edit', uploader.fields([
    { name: 'photos', maxCount: 3 }
]), function (req, res, next) { //jshint ignore:line

    var f = req.body;
    var id = f.id;
    // var title = f.title;

    // if (!title) {
    //     warning.push('"用户名"是必填项');
    // }
    var files = req.files;
    if (files) {
        var names;
        for (var file in files) {
            names = [];
            var field = files[file];
            for (var i = 0; i < field.length; i++) {
                names.push(field[i].filename);
            }
            f[file] = names;
        }
    }
    Artwork.findOne({ _id: utils.getMongoId(id) }).exec(function (err, item) {
        if (err) {
            return next(err);
        }
    });
    var alters = {};
    /*
    for (var key in f) {
        if (f[key]) {
            alters[key] = f[key];
        }
    }
    */
    alters = {
        title: f.title,
        artist: f.artist,
        coartist: f.coartist,
        category: f.category,
        times: f.times,
        size: f.size,
        remarks: f.remarks,
        url: f.url
    };
    if (f.photos) {
        alters.photos = f.photos;
    }

    Artwork.update({ _id: id }, {
        $set: alters
    }).exec(function (err, result) {
        if (err) {
            next(err);
        }
        if (result) {
            req.flash('success', ['数据已更新']);
        }
        return res.redirect('/artwork');
    });
});

module.exports = router;
