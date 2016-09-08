'use strict';

var express = require('express');
var router = express.Router();
// var mongoose = require('mongoose');
var multer = require('multer');
var uploader = multer({
    dest: './public/uploads'
});
var tool = require('../bin/utils');

var Identify = require('../models/Identify');
var Applicant = require('../models/Applicant');
var Identity = require('../models/Identity');
var Verify = require('../models/Verify');
// router.use(function(req, res, next){
//     next();
// });
router.use(function(req, res, next) {
    if (!(req.user && req.user.usertype.indexOf('admin') > -1)) {
        req.flash('warning', ['无权访问, 请先登录']);
        return res.redirect('/login');
    }
    return next();
});
router.get('/pre', function(req, res, next) { //jshint ignore: line
    res.render('./verify/pre');
});


/* GET home page. */
router.get('/compare', function(req, res, next) { //jshint ignore: line
    var vid = req.session.verify_id,
        iid = req.session.identify_id;
    if (!(vid && iid)) {
        return res.redirect('/search');
    }
    // delete req.session.verify_id;
    // delete req.session.identify_id;
    Identify.findOne({ _id: tool.getMongoId(iid) }).populate([{
        path: 'docs',
        select: 'fullview preview magnifyview zoom',
        options: {
            sort: { ts: -1 }
        }
    }]).exec(function(err, idf) {
        if (err) {
            req.flash('warning', ['数据库查询错误']);
            return next(err);
        }
        if (!idf) {
            req.flash('info', ['尚无数据']);
        }
        return res.render('./verify/compare',{
            docs: idf.docs
        });
    });

});

router.get('/req/:id', function(req, res, next) { //jshint ignore: line
    var iid = req.params.id;
    console.log('::req/',iid);
    req.session.verify_id = iid;
    Identify.find({ _id: tool.getMongoId(iid) }).exec(function(err, idf) {
        if (err) {
            req.flash('warning', ['数据库查询错误']);
            return next(err);
        }
        if (!idf) {
            req.flash('info', ['尚无数据']);
            return res.redirect('/search/');
        }
        req.user.identify_id = iid;
        req.session.identify_id = iid;
        return res.render('./verify/pre', {
            identify_id: iid
        });
    });
});

router.post('/compare/pre', uploader.fields([
    { name: 'attachments', maxCount: 1 },
    { name: 'photos', maxCount: 1 }
]), function(req, res, next) { //jshint ignore: line
    var form = req.body;
    var files = req.files;
    var identify_id = req.session.identify_id;
    console.log(':/compare/pre:: ', req.session);
    var retryUrl = '/verify/compare/req/' + identify_id;
    if (!files) {
        req.flash('warning', ['请上传认证附件/作品合影']);
        return res.redirect(retryUrl);
    }

    for (var file in files) {
        form[file] = files[file][0].filename;
    }

    var applicant = new Applicant({
        name: req.body.name,
        tel: req.body.tel,
        idno: req.body.idno,
        attachments: [form.attachments],
        photos: [form.photos]
    });
    applicant.save(function(err, app) {
        if (err) {
            req.flash('warning', ['访问数据库出错']);
            return next(err);
        }
        if (!app) {
            req.flash('warning', ['未能保存成功']);
            return res.redirect(retryUrl);
        }
        console.log('-----------\n',identify_id);
        Identity.findOne({ identifys: {$all: [tool.getMongoId(identify_id)]} }).exec(function(err, idt) {
            if (err) {
                req.flash('warning', ['访问数据库出错']);
                return next(err);
            }
            console.log(identify_id);
            if (!idt) {
                req.flash('info', ['查无此记录']);
                return res.redirect('/search');
            }
            var verify = new Verify({
                records: [],
                applicant: app._id
            });
            verify.save(function(err, vrf) {
                if (err) {
                    req.flash('warning', ['访问数据库出错']);
                    return next(err);
                }
                if (!vrf) {
                    req.flash('warning', ['未能保存成功']);
                    return res.redirect(retryUrl);
                }
                if (!idt.verifys) {
                    idt.verifys = [];
                }
                req.session.verify_id = vrf._id;
                idt.verifys.push(vrf._id);
                idt.save(function(err, idt2) {
                    if (err) {
                        req.flash('warning', ['访问数据库出错']);
                        return next(err);
                    }
                    if (!idt2) {
                        req.flash('warning', ['未能保存成功']);
                        return res.redirect(retryUrl);
                    }
                    req.flash('success', ['申请者档案保存成功']);

                    return res.redirect('/verify/compare?iid=' + identify_id + '&vid=' + vrf._id);
                });
            });
        });
    });
});


module.exports = router;
