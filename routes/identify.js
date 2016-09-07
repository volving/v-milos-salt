'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var multer = require('multer');
var uploader = multer({
    dest: './public/uploads'
});

var Identify = require('../models/Identify'),
    Identity = require('../models/Identity'),
    Applicant = require('../models/Applicant'),
    Artwork = require('../models/Artwork'),
    Artist = require('../models/Artist'),
    Doc = require('../models/Doc');

function getMongoId(str) {
    return mongoose.Types.ObjectId(str);
}

router.use(function(req, res, next) {
    if (!req.user) {
        req.flash('info', ['请您先登录']);
        return res.redirect('/login');
    }
    next();
});

router.get('/', function(req, res) { //jshint ignore: line
    res.render('./identify/ack');
});

router.get('/pre', function(req, res) { //jshint ignore: line
    res.render('./identify/pre', {
        // csrfToken: req.csrfToken(),
    });
});

router.post('/pre', uploader.fields([
    { name: 'attachments', maxCount: 1 },
    { name: 'photos', maxCount: 1 }
]), function(req, res, next) { //jshint ignore: line
    var form = req.body;
    var files = req.files;
    if (!files) {
        return res.redirect('/identify/record');
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
    var objs = {};

    /**
     * save applicant
     * save artist & coartist
     * save artwork
     * save identify && add req.session.identify_id
     * save identity && add req.session.identity_id
     */
    //------------------------------------------------Start of /pre process
    // save applicant
    applicant.save().then(function(obj) {
        // save artist & coartist
        objs.applicant = obj;
        if (req.body.artist) {
            var artist = new Artist({
                name: req.body.artist
            });
            return artist.save().then(function(obj) {
                objs.artist = obj;
                if (req.body.coartist) {
                    var coartist = new Artist({
                        name: req.body.coartist
                    });
                    return coartist.save().then(function(obj) {
                        if (obj) {
                            objs.coartist = obj;
                        }
                        return objs;
                    });
                }
                return objs;
            });
        }
        return objs;
    }).then(function() {
        // save artwork
        var artist_id = objs.artist && objs.artist._id || undefined,
            coartist_id = objs.coartist && objs.coartist._id || undefined;
        var artwork = new Artwork({
            title: req.body.title,
            artist: getMongoId(artist_id),
            coartist: getMongoId(coartist_id),
            category: req.body.category,
            times: req.body.times,
            size: req.body.size,
            onplatform: req.body.onplatform,
            url: req.body.url

        });
        return artwork.save().then(function(obj) {
            if (!obj) {
                req.flash('danger', ['信息保存失败']);
                throw new Error('Artwork 保存失败');
            }
            objs.artwork = obj;
            return objs;
        });
    }).then(function() {
        // save identify && add req.session.identify_id
        var identify = new Identify({
            applicant: objs.applicant._id,
            docs: []
        });
        return identify.save().then(function(obj) {
            if (!obj) {
                req.flash('danger', ['信息保存失败']);
                throw new Error('Identify 保存失败');
            }

            objs.identify = obj;
            var _id = obj._id;
            req.session.identify_id = _id;

            return objs;
        });
    }).then(function() {
        // save identity && add req.session.identity_id
        var sid = new mongoose.Types.ObjectId();

        var title = objs.artworkd && objs.artworkd.title || '',
            artist = objs.artwork && objs.artwork.artist || undefined,
            artwork = objs.artwork && objs.artwork._id || undefined,
            identify = objs.identify && objs.identify._id || undefined,
            identifys = [];
        if (identity) {
            identifys.push(identify);
        }
        var identity = new Identity({
            sid: sid,
            title: title,
            artist: artist,
            artwork: artwork,
            identifys: identifys,
            verifys: [],
            availability: 'creating'
        });
        return identity.save().then(function(obj) {
            if (!obj) {
                req.flash('danger', ['信息保存失败']);
                throw new Error('Identity 保存失败');
            }
            var _id = obj._id;
            if (req.session) {
                req.session.identity_id = _id;
            }
            res.redirect('/identify/record');
        });
    }).catch(function(err) {
        req.flash('danger', ['发生了其他错误']);
        return next(err);
    });
    //------------------------------------------------End __of /pre process
});


router.get('/record', function(req, res, next) { //jshint ignore: line
    var identify_id = req.session.identify_id;
    if (!identify_id) {
        req.flash('warning', ['请按照流程进行操作']);
        return res.redirect('/identify/pre');
    }
    Identify.findOne({ _id: getMongoId(identify_id) }).populate('docs').exec().then(function(obj) {
        if (!obj) {
            req.flash('warning', ['未能找到对应的记录']);
            res.redirect('/identify/pre');
        }
        var docs = obj.docs;
        res.render('./identify/record', {
            // csrfToken: req.csrfToken(),
            identify_id: identify_id,
            docs: docs
        });
    }).catch(function(err) {
        return next(err);
    });
});

router.post('/record', uploader.fields([
    { name: 'fullview', maxCount: 1 },
    { name: 'preview', maxCount: 1 },
    { name: 'magnifyview', maxCount: 1 }
]), function(req, res, next) { //jshint ignore: line

    var form = req.body;
    var files = req.files;
    if (!files) {
        return res.redirect('/identify/record');
    }
    for (var file in files) {
        form[file] = files[file][0].filename;
    }
    var doc = new Doc({
        fullview: form.fullview,
        preview: form.preview,
        magnifyview: form.magnifyview,
        zoom: form.zoom,
        remarks: form.remarks
    });
    doc.save(function(err, obj) {
        var identify_id = req.session.identify_id;
        // if (!(identify_id&&identity_id)) {
        //     req.flash('warning', ['所需参数未能提供而出错, 请按流程操作']);
        //     return;
        // }
        // console.log(obj, identify_id);
        if (err) {
            req.flash('warning', ['保存时发生错误']);
            return next(err);
        }
        if (!obj) {
            req.flash('warning', ['该纸纹记录未能保存成功']);
            return req.redirect('/identify/record');
        }
        if (obj && identify_id) {
            Identify.findOne({ _id: getMongoId(identify_id) }).exec(function(err, idf) {
                if (err) {
                    return next(err);
                }
                if (!idf) {
                    req.flash('warning', ['未能找到对应的艺术品']);
                    return req.redirect('/identify/record');
                }
                idf.docs.push(obj._id);
                idf.save(function(err, idtf) {
                    if (err) {
                        return next(err);
                    }
                    if (!idtf) {
                        req.flash('warning', ['未能将该纸纹记录添加到对应艺术品']);
                        return req.redirect('/identify/record');
                    }
                    return res.redirect('/identify/record');
                });
                return idf;
            });
        }
    });
});

router.get('/post', function(req, res) { //jshint ignore: line
    delete req.session.identify_id;
    res.render('./identify/post');
});


router.get('/verify', function(req, res) { //jshint ignore: line

});

router.post('/upload', uploader.any(), function(req, res, next) { //jshint ignore: line
    var filename = req.file.filename;
    res.json({
        filename: filename
    });
});

router.get('/manage', function(req, res, next) { //jshint ignore: line

});

module.exports = router;
