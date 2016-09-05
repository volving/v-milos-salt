'use strict';
var express = require('express');
var router = express.Router();
var Identity = require('../models/Identity');


router.get('/', function(req, res) { //jshint ignore: line
    res.render('./identify/ack');
});

router.get('/pre', function(req, res) { //jshint ignore: line
    res.render('./identify/pre',{
        csrfToken: req.csrfToken(),
    });
});

router.post('/pre', function(req, res) { //jshint ignore: line

});

router.get('/record', function(req, res) { //jshint ignore: line

});

router.post('/record', function(req, res) { //jshint ignore: line

});

router.get('/post', function(req, res) { //jshint ignore: line

});

router.post('/post', function(req, res) { //jshint ignore: line

});

router.get('/verify', function(req, res) { //jshint ignore: line

});


module.exports = router;
