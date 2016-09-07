'use strict';

var express = require('express');
var router = express.Router();
var Identity = require('../models/Identity');
var Artist = require('../models/Artist');
var Artwork = require('../models/Artwork');
var Doc = require('../models/Doc');
var Applicant = require('../models/Applicant');

var multer = require('multer');
var uploader = multer({
    dest: './public/uploads'
});


router.use(function(req, res, next) { //jshint ignore: line
    if (!(req.user && req.user.usertype.indexOf('admin') > -1)) {
        req.flash('warning', ['无权访问, 请先登录管理员账号']);
        return res.redirect('/login');
    }
    next();
});

router.get('/', function(req, res, next) { //jshint ignore: line
    res.render('admin/controlpanel');
});

//------------------------------------------------Start of IDENTITY

router.get('/identity', function(req, res, next) { //jshint ignore: line
    Identity.find({}).populate('artwork verifys identifys').exec(function(err, idts) {
        if (err) {
            req.flash('warning', ['数据查询出错']);
            return res.redirect('/admin');
        }
        if (!idts) {
            req.flash('warning', ['没有数据']);
            return res.render('./admin/identity');
        }
        return res.render('./admin/identity', {
            title: '品籍档案',
            identitys: idts
        });
    });
});

router.get('/identity/create', function(req, res, next) { //jshint ignore: line
    Applicant.find({}).exec(function(err, applicants) {
        if (err) {
            req.flash('warning', ['查询申请者档案时出错']);
            return next(err);
        }
        if (!applicants) {
            req.flash('warning', ['尚无申请者档案, 请先创建']);
            return res.redirect('/admin/identity');
        }
        return res.render('admin/identity_create', {
            title: '新建艺术品档案',
            applicants: applicants
        });
    });
});
router.post('/artwork/create', function(req, res, next) { //jshint ignore: line
    console.log(req.body);
    var title = req.body.title || '',
        artist = req.body.artist || undefined,
        coartist = req.body.coartist || undefined,
        category = req.body.category || '',
        times = req.body.times || '',
        size = req.body.size || '',
        remarks = req.body.remarks || '',
        onplatform = req.body.onplatform || false,
        url = req.body.url || '';
    var artwork = new Artwork({
        title: title,
        artist: artist,
        coartist: coartist,
        category: category,
        times: times,
        size: size,
        remarks: remarks,
        onplatform: onplatform,
        url: url
    });
    artwork.save(function(err, artwork) {
        if (err) {
            req.flash('warning', ['保存艺术品档案过程中出错']);
            return next(err);
        }
        if (!artwork) {
            req.flash('warning', ['未能保存成功']);
        }
        req.flash('success', ['保存成功']);
        return res.redirect('/admin/artwork/create');
    });
});

//------------------------------------------------End __of IDENTITY


//------------------------------------------------Start of ARTIST

router.get('/artist', function(req, res, next) { //jshint ignore: line
    Artist.find({}).exec(function(err, artists) {
        if (err) {
            req.flash('warning', ['查询艺术家档案过程中出错']);
            return next(err);
        }
        if (!artists) {
            req.flash('warning', ['查询艺术家档案过程中出错']);
            return res.render('admin/artist', {
                title: '艺术家档案'
            });
        }
        return res.render('admin/artist', {
            title: '艺术家档案',
            artists: artists
        });
    });
});


router.get('/artist/create', function(req, res, next) { //jshint ignore: line
    return res.render('admin/artist_create', {
        title: '新建艺术家档案',
    });
});
router.post('/artist/create', function(req, res, next) { //jshint ignore: line
    console.log(req.body);
    var name = req.body.name || '',
        title = req.body.title || '',
        called = req.body.called || '',
        dob = req.body.dob || undefined,
        remarks = req.body.remarks || '',
        onplatform = req.body.onplatform || false,
        url = req.body.url || '';
    var artist = new Artist({
        name: name,
        title: title,
        called: called,
        dob: dob,
        remarks: remarks,
        onplatform: onplatform,
        url: url
    });
    artist.save(function(err, artist) {
        if (err) {
            req.flash('warning', ['保存艺术家档案过程中出错']);
            return next(err);
        }
        if (!artist) {
            req.flash('warning', ['保存艺术家档案失败']);
        }
        req.flash('success', ['保存成功']);
        return res.redirect('/admin/artist/create');
    });
});

//------------------------------------------------End __of ARTIST

//------------------------------------------------Start of ARTWORK
router.get('/artwork', function(req, res, next) { //jshint ignore: line
    Artwork.find({}).populate('artist coartist').exec(function(err, artworks) {
        if (err) {
            req.flash('warning', ['查询艺术品档案过程中出错']);
            return next(err);
        }
        if (!artworks) {
            req.flash('warning', ['未能查询到艺术品档案']);
            return res.render('admin/artwork', {
                title: '艺术品档案'
            });
        }
        return res.render('admin/artwork', {
            title: '艺术品档案',
            artworks: artworks
        });

    });
});
router.get('/artwork/create', function(req, res, next) { //jshint ignore: line
    Artist.find({}).exec(function(err, artists) {
        if (err) {
            req.flash('warning', ['查询艺术家档案时出错']);
            return next(err);
        }
        if (!artists) {
            req.flash('warning', ['尚无艺术家档案, 请先创建']);
            return res.redirect('/admin/artist');
        }
        return res.render('admin/artwork_create', {
            title: '新建艺术品档案',
            artists: artists
        });
    });
});
router.post('/artwork/create', function(req, res, next) { //jshint ignore: line
    console.log(req.body);
    var title = req.body.title || '',
        artist = req.body.artist || undefined,
        coartist = req.body.coartist || undefined,
        category = req.body.category || '',
        times = req.body.times || '',
        size = req.body.size || '',
        remarks = req.body.remarks || '',
        onplatform = req.body.onplatform || false,
        url = req.body.url || '';
    var artwork = new Artwork({
        title: title,
        artist: artist,
        coartist: coartist,
        category: category,
        times: times,
        size: size,
        remarks: remarks,
        onplatform: onplatform,
        url: url
    });
    artwork.save(function(err, artwork) {
        if (err) {
            req.flash('warning', ['保存艺术品档案过程中出错']);
            return next(err);
        }
        if (!artwork) {
            req.flash('warning', ['未能保存成功']);
        }
        req.flash('success', ['保存成功']);
        return res.redirect('/admin/artwork/create');
    });
});
//------------------------------------------------End __of ARTWORK

//------------------------------------------------Start of DOC
router.get('/doc', function(req, res, next) { //jshint ignore: line
    Doc.find({}).exec(function(err, docs) {
        if (err) {
            req.flash('warning', ['查询纸纹档案过程中出错']);
            return next(err);
        }
        if (!docs) {
            req.flash('warning', ['未能查询到纸纹档案']);
            return res.render('admin/doc', {
                title: '纸纹档案'
            });
        }
        return res.render('admin/doc', {
            title: '纸纹档案',
            docs: docs
        });

    });
});
router.get('/doc/create', function(req, res, next) { //jshint ignore: line
    res.render('admin/doc_create');
});

router.post('/doc/create', uploader.fields([
    { name: 'fullview', maxCount: 1 },
    { name: 'preview', maxCount: 1 },
    { name: 'magnifyview', maxCount: 1 }
]), function(req, res, next) { //jshint ignore: line
    var form = req.body;
    var files = req.files;
    if (!files) {
        req.flash('warning', ['没有添加文件']);
        return res.redirect('/admin/doc/create');
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
        if (err) {
            req.flash('warning', ['保存纸纹档案时发生错误']);
            return next(err);
        }
        if (!obj) {
            req.flash('warning', ['纸纹档案保存失败']);
            return res.redirect('/admin/doc/create');
        }
        req.flash('warning', ['纸纹档案保存成功']);
        return res.redirect('/admin/doc');

    });
});

//------------------------------------------------End __of DOC


//------------------------------------------------Start of APPLICANT
router.get('/applicant', function(req, res, next) { //jshint ignore: line
    Applicant.find({}).exec(function(err, applicants) {
        if (err) {
            req.flash('warning', ['查询申请者档案过程中出错']);
            return next(err);
        }
        if (!applicants) {
            req.flash('warning', ['未能查询到申请者档案']);
            return res.render('admin/applicant', {
                title: '申请者档案'
            });
        }
        return res.render('admin/applicant', {
            title: '申请者档案',
            applicants: applicants
        });

    });
});
router.get('/applicant/create', function(req, res, next) { //jshint ignore: line
    res.render('admin/applicant_create');
});

router.post('/applicant/create', uploader.fields([
    { name: 'attachments' },
    { name: 'photos' }
]), function(req, res, next) { //jshint ignore: line
    var form = req.body;
    var files = req.files;
    if (files) {
        // req.flash('warning', ['没有添加文件']);
        // return res.redirect('/admin/applicant/create');
        for (var file in files) {
            form[file] = files[file][0].filename;
        }
    }
    var applicant = new Applicant({
        name: form.name,
        idno: form.idno,
        tel: form.tel,
        attachments: form.attachments,
        photos: form.photos
    });
    applicant.save(function(err, obj) {
        if (err) {
            req.flash('warning', ['保存档案时发生错误']);
            return next(err);
        }
        if (!obj) {
            req.flash('warning', ['档案保存失败']);
            return res.redirect('/admin/applicant/create');
        }
        req.flash('warning', ['档案保存成功']);
        return res.redirect('/admin/applicant');

    });
});

//------------------------------------------------End __of APPLICANT


module.exports = router;
