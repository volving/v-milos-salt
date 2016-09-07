'use strict';

var express = require('express');
var router = express.Router();

router.use(function(req, res, next) { //jshint ignore: line
    console.log(req.user);
    if (!(req.user && req.user.usertype.indexOf('admin') > -1)) {
        req.flash('warning', ['无权访问, 请先登录管理员账号']);
        return res.redirect('/');
    }
    next();
});

router.get('/', function(req, res, next) { //jshint ignore: line
    res.render('admin/controlpanel');
});




module.exports = router;
