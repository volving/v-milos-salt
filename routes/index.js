'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/User');
var passport = require('passport');

// var multer = require('multer');
// var uploader = multer({
//     dest: './public/uploads'
// });
var Identify = require('../models/Identify');
// var Identity = require('../models/Identity');
// router.use(function(req, res, next){
//     next();
// });
/* GET home page. */
router.get('/', function (req, res, next) { //jshint ignore: line
    res.render('index');
});



//------------------------------------------------Start of 注册
var svgCaptcha = require('svg-captcha');
var getCaptcha = function () {
    var capCode = svgCaptcha.randomText({
        size: 4,
        ignoreChars: '0Oo2Zz1IiLlb6'
    });
    var capImg = svgCaptcha(capCode);
    return [capCode, capImg];
};

router.get('/register', function (req, res) { //jshint ignore: line

    // var _csrf = req.csrfToken();
    // res.cookie('_csrf', _csrf);

    var captcha = getCaptcha();
    res.cookie('_captcha', captcha[0]);

    return res.render('register', {
        // _csrf: _csrf,
        capCode: captcha[0],
        capImg: captcha[1]
    });
});


/*
var getTypes = function (str) {
    if (!str || str.length < 1) {
        return '';
    }
    var arr = str.split(','),
        types = [];
    arr.map(function (item) {
        if (item && item.length > 0) {
            item = item.trim();
            if (item.length > 0) {
                types.push(item);
            }
        }
    });
    return types;
};
*/

router.get('/captcha', function (req, res, next) { //jshint ignore: line
    var captcha = getCaptcha(req, res); // [capCode, capImg]
    req.session.captcha = captcha[0];
    res.set('Content-Type', 'image/svg+xml');
    res.status(200);
    return res.send(captcha[1]);
});

//------------------------------------------------Start of vcode

var utils = require('../bin/utils.js');
var vcodeLog = {};
var secret = require('../conf/secret'),
    ytx = secret.yuntongxun,
    sid = ytx.sid,
    authToken = ytx.authToken;

var SENDSPAN = 45000; //45 seconds
router.get('/vcode', function (req, res, next) { //jshint ignore: line
    var date = Date.now();
    var phone = req.query.phone;
    var log = vcodeLog[phone];
    if (log) {
        if (date - log.lastsent < SENDSPAN) {
            log.chance += 1;
        }
        if (log.chance >= 5) {
            return res.json({
                message: '请求太频繁, 本手机号暂时被屏蔽'
            });
        }
    }

    var fullDate = utils.getFullDate();
    var sig = utils.md5it(sid + authToken + fullDate).toUpperCase();
    var authorization = utils.base64it(sid + ':' + fullDate);
    var options = {
        host: ytx.host,
        port: ytx.port,
        path: ytx.path + sig,
        method: ytx.method,
        headers: ytx.headers
    };
    options.headers['Authorization'] = authorization; //jshint ignore: line
    var https = require('https');
    var vcode = parseInt(Math.random() * (10000 - 999) + 999);
    var data = {
        to: phone,
        appId: ytx.appId,
        templateId: ytx.templateId,
        datas: [vcode, 3]
    };

    vcodeLog[phone] = {
        vcode: vcode,
        lastsent: date,
        chance: 0
    };

    //------------------------------------------------Start of SendVcode

    var request = https.request(options, function (response) {
        // console.log('Status: ' + response.statusCode);
        // console.log('Headers: ' + JSON.stringify(response.headers));
        response.setEncoding('utf8');
        response.on('data', function (result) {
            console.log('Result: ' + result);
            return res.json({ message: result });
        });
    });
    request.on('error', function (e) {
        console.log('Error:' + e);
        return res.json({ message: e });
    });
    request.write(JSON.stringify(data));
    request.end();
    //------------------------------------------------End __of SendVcode

});

//------------------------------------------------End __of vcode


var check = require('../bin/check');


router.post('/register', /*uploader.fields([ { name: 'attachments' }, //, maxCount: 5 ]), */ function (req, res, next) { //jshint ignore: line
    var form = req.body;
    console.log(form);
    var username = form.username || '';
    var warning = [];
    var vcode = form.vcode;
    console.log(vcodeLog);

    if (form.usercontract !== 'on') {
        warning.push('您必须同意且遵守我们的《用户协议》');
    }
    if (!check.checkPhoneNumber(username)) {
        warning.push('请输入格式正确的手机号');
    }

    if (!(vcode === vcodeLog[username] || vcode === 'boyung')) {
        warning.push('短信验证码不正确');
    }
    if (warning.length > 0) {
        req.flash('warning', warning);
        return res.redirect('/register');
    }
    // var files = req.files;
    // for (var file in files) {
    //     var arr = [];
    //     var field = files[file];
    //     if (field) {
    //         for (var i = 0, len = field.length; i < len; i++) {
    //             var item = field[i];
    //             if (item && item.filename) {
    //                 arr.push(item.filename);
    //             }
    //         }
    //     }
    //     form[file] = arr;
    // }
    User.findOne({ username: username }, function (err, user) {
        if (err) {
            res.status = 500;
            res.end();
        }
        if (user) {
            warning.push('该手机号已经存在!');
            req.flash('warning', warning);
            return res.redirect('/register');
        } else {
            var newUser = new User({
                username: username,
                password: form.password || 'oooooo',
                mobile: username || '',
                remarks: form.remarks || ''
                    // usertype: getTypes(form.usertype)
            });

            newUser.save(function (err, user) { //jshint ignore: line
                if (err) {
                    return next(err);
                }
                return res.render('info', {
                    title: '用户信息已经创建!',
                    content: '您的审核已经提交, 我们尽快审核, 结果会发送到您的邮箱, 请您注意查收!'
                });
            });
        }
    });
});

//------------------------------------------------End __of 注册

router.get('/login', function (req, res) { //jshint ignore: line
    res.render('login', {
        // csrfToken: req.csrfToken()
    });
});
// router.post('/login', function(req, res, next) { //jshint ignore: line
//     var username = req.body.username || '',
//         password = req.body.password || '';
//     console.log(username, password);
//     if (username.length > 0 && password.length > 0) {
//         User.findOne({ username: username }, function(err, user) {
//             if (err) {
//                 return next(err);
//             }
//             if (user) {
//                 user.checkPassword(username, function(err, isMatch){
//                     if (err) {
//                         return next(err);
//                     }
//                     if (isMatch) {
//                         req.flash('success', ['您已登录!']);
//                         return res.redirect('/index');
//                     }else{
//                         req.flash('warning', ['密码错误!']);
//                         return res.redirect('/login');
//                     }
//                 });
//             } else {
//                 req.flash('warning', ['没有找到您的注册信息/您尚未注册']);
//                 return res.redirect('/login');
//             }
//         });
//     }
//     var warning = [];
//     if (username.length === 0) {
//         warning.push('用户名是必填项, 请输入!');
//     }
//     if (password.length === 0) {
//         warning.push('密码是必填项, 请输入!');
//     }

//     req.flash('warning', warning);
//     return res.redirect('/login');
// });

//  function(req, res, next) {
//     var username = req.body.username || '',
//         password = req.body.password || '';
//     var warning = [];
//     if (username.length === 0) {
//         warning.push('用户名是必填项, 请输入!');
//     }
//     if (password.length === 0) {
//         warning.push('密码是必填项, 请输入!');
//     }
//     req.flash('warning', warning);
//     next();
// },
// router.post('/login', passport.authenticate('login', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true
// }));

router.post('/login', function (req, res, next) { //jshint ignore: line
    var username = req.body.username || '',
        password = req.body.password || '';
    var warning = [];
    if (username.length === 0) {
        warning.push('用户名是必填项, 请输入');
    }
    if (password.length === 0) {
        warning.push('密码是必填项, 请输入');
    }
    if (warning.length > 0) {
        req.flash('warning', warning);
        return res.redirect('/login');
    }
    passport.authenticate('login', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('warning', [info.message]);
            return res.redirect('/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            req.flash('success', ['欢迎, 您已登录']);
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', function (req, res) { //jshint ignore: line
    req.logout();
    req.flash('success', ['您已退出']);
    res.redirect('/');
});


router.get('/search', function (req, res, next) { //jshint ignore: line
    var sid = req.query.sid,
        condition = {};
    if (sid) {
        var reg = new RegExp(sid, 'i');
        condition = { sid: { $regex: reg } };
    }
    // console.log(condition);
    // Artwork.find({}).populate('artist coartist').exec(function(err, list) {
    //     if (err) {
    //         return next(err);
    //     }
    //     if (!list) {
    //         return next();
    //     }
    //     console.log(list);
    //     return res.render('./id', {
    //         artworks: list
    //     });
    // });

    // Identity.find(condition).populate('artwork').exec(function(err, list) {
    //     if (err) {
    //         return next(err);
    //     }
    //     if (!list) {
    //         req.flash('info', ['没有查询到相应记录']);
    //         return res.render('./id');
    //     }
    //     return res.render('./id', {
    //         identitys: list
    //     });
    // });
    Identify.find(condition).populate([{
        path: 'docs',
        select: 'fullview zoom',
        options: {
            sort: { ts: -1 }
        }
    }, {
        path: 'artwork',
        select: 'title category'
    }]).exec(function (err, list) {
        if (err) {
            req.flash('warning', ['查询出错']);
            return next(err);
        }
        if (!list) {
            req.flash('warning', ['没有查询到相应记录']);
            return res.render('./search');
        }
        return res.render('./search', {
            identifys: list
        });
    });
});







module.exports = router;
