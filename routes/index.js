'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/User');
var passport = require('passport');

// router.use(function(req, res, next){
//     next();
// });
/* GET home page. */
router.get('/', function(req, res, next) { //jshint ignore: line
    res.render('index', { title: 'Express' });
});
router.get('/register', function(req, res) { //jshint ignore: line
    res.render('register', {
        // csrfToken: req.csrfToken()
    });
});

var getTypes = function(str) {
    if (!str || str.length < 1) {
        return '';
    }
    var arr = str.split(','),
        types = [];
    arr.map(function(item) {
        if (item && item.length > 0) {
            item = item.trim();
            if (item.length > 0) {
                types.push(item);
            }
        }
    });
    return types;
};

router.post('/register', function(req, res, next) { //jshint ignore: line
    var username = req.body.username || '';
    if (username.length > 3) {
        User.findOne({ username: username }, function(err, user) {
            if (err) {
                res.status = 500;
                res.end();
            }
            if (user) {
                req.flash('warning', ['该用户名已经存在!']);
                res.redirect('/register');
            } else {
                var newUser = new User({
                    username: username,
                    password: req.body.password || 'oooooo',
                    nickname: req.body.nickname || '',
                    fullname: req.body.fullname || '',
                    gender: req.body.gender || '',
                    region: req.body.region || '',
                    email: req.body.email || '',
                    mobile: req.body.mobile || '',
                    idno: req.body.idno || '',
                    attachment: req.body.attachment || '',
                    remarks: req.body.remarks || '',
                    usertype: getTypes(req.body.usertype)
                });

                newUser.save(function(err, user) { //jshint ignore: line
                    if (err) {
                        next(err);
                    }
                    res.render('info', {
                        title: '用户信息已经创建!',
                        content: '您的审核已经提交, 我们尽快审核, 结果会发送到您的邮箱, 请您注意查收!'
                    });
                });
            }
        });
    } else {
        req.flash('warning', ['请先完成输入!']);
        res.redirect('/register');
    }

});


router.get('/login', function(req, res) { //jshint ignore: line
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

router.post('/login', function(req, res, next) { //jshint ignore: line
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
        res.redirect('/login');
    }
    passport.authenticate('login', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('warning', [info.message]);
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            req.flash('success', ['欢迎登录!']);
            res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', function(req, res) { //jshint ignore: line
    req.logout();
    res.redirect('/');
});


module.exports = router;
