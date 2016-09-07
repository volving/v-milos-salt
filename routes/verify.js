'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer = require('multer');
var uploader = multer({
    dest: './public/uploads'
});
var tool = require('../bin/utils');

var Identify = require('../models/Identify');
// var Identity = require('../models/Identity');
// router.use(function(req, res, next){
//     next();
// });

/* GET home page. */
router.get('/compare', function(req, res, next) { //jshint ignore: line
    res.render('index');
});
router.get('/compare/:id', function(req, res, next) { //jshint ignore: line
    var id = req.params.id;
    Identify.find({ _id: tool.getMongoId(id) }).exec(function(err, obj) {
        if (err) {
            req.flash('warning', ['数据库查询错误']);
            return next(err);
        }
        if (!obj) {
            req.flash('info', ['尚无数据']);
            return res.redirect('/search/');
        }
        return res.render('./verify/pre',{
            identify: obj,
            exists: true
        });

    });
});


module.exports = router;
