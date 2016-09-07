'use strict';

var express = require('express');
var router = express.Router();
var Identity = require('../models/Identity');
var Artist = require('../models/Artist');
var Artwork = require('../models/Artwork');

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
            title: '管理艺术品纸纹档案',
            identitys: idts
        });
    });
});

router.get('/identity/create', function(req, res, next) { //jshint ignore: line
    return res.render('admin/identity_create');
});


//------------------------------------------------Start of ARTIST

router.get('/artist', function(req, res, next) { //jshint ignore: line
    Artist.find({}).exec(function(err, artists) {
        if (err) {
            req.flash('warning', ['查询艺术家信息过程中出错']);
            return next(err);
        }
        if (!artists) {
            req.flash('warning', ['保存艺术家信息过程中出错']);
            return res.render('admin/artist',{
                title: '管理艺术家档案'
            });
        }
        return res.render('admin/artist', {
            title: '管理艺术家档案',
            artists: artists
        });
    });
});


router.get('/artist/create', function(req, res, next) { //jshint ignore: line
    return res.render('admin/artist_create',{
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
            req.flash('warning', ['保存艺术家信息过程中出错']);
            return next(err);
        }
        if (!artist) {
            req.flash('warning', ['未能保存成功']);
        }
        req.flash('success', ['保存成功']);
        return res.redirect('/admin/artist/create');
    });
});

//------------------------------------------------End __of ARTIST

//------------------------------------------------Start of ARTWORK
router.get('/artwork', function(req, res, next) { //jshint ignore: line
    Artwork.find({}).populate('artist coartist').exec(function(err, artworks){
        if (err) {
            req.flash('warning', ['查询艺术品信息过程中出错']);
            return next(err);
        }
        if (!artworks) {
            req.flash('warning', ['保存艺术品信息过程中出错']);
            return res.render('admin/artwork',{
                title: '管理艺术品'
            });
        }
        console.log(artworks);
        return res.render('admin/artwork', {
            title: '管理艺术品',
            artworks: artworks
        });

    });
});
router.get('/artwork/create', function(req, res, next) { //jshint ignore: line
    Artist.find({}).exec(function(err, artists){
        if (err) {
            req.flash('warning', ['查询艺术家档案时出错']);
            return next(err);
        }
        if (!artists) {
            req.flash('warning', ['尚无艺术家档案, 请先创建']);
            return res.redirect('/admin/artist');
        }
        return res.render('admin/artwork_create',{
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
            req.flash('warning', ['保存艺术品信息过程中出错']);
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


module.exports = router;
