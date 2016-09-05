'use strict';
var express = require('express');
var router = express.Router();
var Agent = require('../models/Agent');


router.all('/', function(req, res) { //jshint ignore: line
    var limit = Number(req.body.amt) || 20;
    if (limit < 10 || limit > 50) {
        limit = 10;
    }
    var queryName = req.body.name;
    var reg = new RegExp(queryName, 'i');
    var total = 0;
    Agent.find({ name: reg }).count().exec(function(err, count) {
        total = count;
    });
    Agent.find({ name: reg }).limit(limit).exec(function(err, agents) {
        res.render('./agent/list', {
            // csrfToken: req.csrfToken(),
            agents: agents,
            total: total,
            pageLimit: limit,
            pageSize: Math.ceil(total / limit)
        });
    });
});

router.get('/create', function(req, res, next) { //jshint ignore: line
    res.render('./agent/create', {
        // csrfToken: req.csrfToken(),
        item: {

        }
    });
});
router.post('/create', function(req, res, next) { //jshint ignore: line
    Agent.create({
        name: req.body.name || 'anonymous',
        address: req.body.address || '',
        tel: req.body.tel || '',
        email: req.body.email || '',
        business_hours: req.body.business_hours || '',
        contact: {
            name: req.body.manager,
            tel: req.body.managerTel
        }
    }, function(err, agent) { //jshint ignore: line
        if (err) {
            return next(err);
        }
        req.flash('success', ['数据已存储']);
        res.redirect('/agent/' + agent._id);
    });
});

router.get('/:id', function(req, res, next) { //jshint ignore: line
    var id = req.params.id;
    if (id.length < 24) {
        req.flash('warning', ['没有该记录']);
        return res.redirect('/agent');
    }
    Agent.findOne({
        _id: id
    }).exec(function(err, agent) {
        if (err) {
            req.flash('warning', ['查询出错']);
            return next(err);
        }
        if (!agent) {
            req.flash('warning', ['没有该记录']);
            return res.redirect('/agent');
        }
        res.render('./agent/edit', {
            // csrfToken: req.csrfToken(),
            item: agent
        });
    });
});


router.post('/upsert', function(req, res, next) { //jshint ignore: line
    var _id = req.body._id;
    if (!_id || _id.length < 24) {
        req.flash('warning', ['没有该记录']);
        return res.redirect('/agent');
    }

    Agent.findOneAndUpdate({
        _id: _id,
    }, {
        name: req.body.name || 'anonymous',
        address: req.body.address || '',
        tel: req.body.tel || '',
        email: req.body.email || '',
        business_hours: req.body.business_hours || '',
        contact: {
            name: req.body.manager,
            tel: req.body.managerTel
        }
    }, {
        new: true,
        upsert: true
    }).exec(function(err, agent) { //jshint ignore: line
        if (err) {
            return next(err);
        }
        req.flash('success', ['数据已存储']);
        res.redirect('/agent/' + _id);
    });

});



module.exports = router;
