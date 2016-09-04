'use strict';
var express = require('express');
var router = express.Router();

router.get('/process', function(req, res) { //jshint ignore: line
    res.render('about/article',{
        title: '指纹系统流程介绍'
    });
});

router.get('/contactus', function(req, res) { //jshint ignore: line
    res.render('about/article',{
        title: '联系我们'
    });
});

module.exports = router;
