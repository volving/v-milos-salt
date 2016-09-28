'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/User');


/* GET users listing. */
router.get('/:id', function (req, res, next) { //jshint ignore:line
    var id = req.params.id;
    if (!id) {
        req.flash('warning', 'URL无效!');
        return res.redirect('/');
    }
    // User.findOne({
    //     _id: id
    // })
    // res.send('respond with a resource');
});

module.exports = router;
