'use strict';
var express = require('express');
var router = express.Router();
var multer = require('multer');
var mongoose = require('mongoose');

var uploader = multer({
    dest: './public/uploads'
});

var Identify = require('../models/Identify'),
    Identity = require('../models/Identity'),
    Applicant = require('../models/Applicant'),
    Artwork = require('../models/Artwork'),
    Artist = require('../models/Artist'),
    Doc = require('../models/Doc');

function getMongoId(str){
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
    { name: 'photo', maxCount: 1 }
]), function(req, res, next) { //jshint ignore: line
    var form = req.body;
    var files = req.files;
    if (!files) {
        return res.redirect('/identify/record');
    }
    console.log(files);
    for (var file in files) {
        form[file] = files[file][0].filename;
    }

    var applicant = new Applicant({
        name: req.body.name,
        tel: req.body.tel,
        idno: req.body.idno,
        attachment: form.attachments,
        photo: form.photo
    });
    var objs = {};
    applicant.save().then(function(obj) {
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
        var artist_id = objs.artist && objs.artist._id || undefined,
            coartist_id = objs.coartist && objs.coartist._id || undefined;
            console.log('artist_id:' + artist_id);
            console.log('coartist_id:' + coartist_id);
        var artwork = new Artwork({
            title: req.body.title,
            artist: getMongoId(artist_id),
            coartist: getMongoId(coartist_id),
            category: req.body.category,
            times: req.body.times,
            size: req.body.size,
            onplatform: req.body.onplatform
        });
        return artwork.save().then(function(obj) {
            if (obj) {
                objs.artwork = obj;
            }
            return objs;
        });
    }).then(function() {
        var identify = new Identify({
            applicant: objs.applicant._id,
            artwork: objs.artwork._id,
            docs: []
        });
        return identify.save().then(function(obj) {
            if (obj) {
                objs.identify = obj;
                var _id = obj._id;
                req.session.identify_id = _id;
            }
            return objs;
        });
    }).then(function() {
        var identity = new Identity({
            artwork: objs.artwork._id,
            identifys: [objs._id],
            verifys: [],
            availability: 'creating'
        });
        return identity.save().then(function(obj) {
            if (obj) {
                var _id = obj._id;
                if (req.user) {
                    req.user.identity_id = _id;
                }
                res.redirect('/identify/record');
            }
        });
    }).catch(function(err) {
        return next(err);
    });
});

router.get('/record', function(req, res, next) { //jshint ignore: line
    var identify_id = req.session.identify_id;
    if (!identify_id) {
        req.flash('warning', ['请按照流程进行操作']);
        return res.redirect('/identify/pre');
    }
    Identify.findOne({ _id: mongoose.Types.ObjectId(identify_id) }).populate('docs').exec().then(function(obj) {
        if (obj) {
            var docs = obj.docs;
            res.render('./identify/record', {
                // csrfToken: req.csrfToken(),
                identify_id: identify_id,
                docs: docs
            });
        } else {
            req.flash('warning', ['未能找到对应的记录']);
            return res.redirect('/identify/pre');
        }
    }).catch(function(err){
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
        remarks: form.zoom
    });
    doc.save(function(err, obj) {
        var identify_id = req.session.identify_id;
        // if (!(identify_id&&identity_id)) {
        //     req.flash('warning', ['所需参数未能提供而出错, 请按流程操作']);
        //     return;
        // }
        // console.log(obj, identify_id);
        if (obj && identify_id) {
            Identify.findOne({ _id: getMongoId(identify_id)}).exec(function(err, idf) {
                if (idf) {
                    idf.docs.push(obj._id);
                    // var docs = idf.docs || [];
                    //     docs.push(obj._id);
                    // idf.docs = docs;
                    // obj.docs = [obj._id];
                    idf.save(function(err, idtf){
                        if (err) {
                            return next(err);
                        }
                        if (!idtf) {
                            return next();
                        }
                        delete req.session.identify_id;
                        return res.redirect('/identify/post');
                    });
                    return idf;
                }
            });
        }
    });
});

router.get('/post', function(req, res) { //jshint ignore: line
    console.log(req.session);
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

module.exports = router;
