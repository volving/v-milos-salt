'use strict';
var conf = require('./conf/secret');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var xssFilter = require('x-xss-protection');
var helmet = require('helmet');
var flash = require('connect-flash');
// var timeout = require('connect-timeout');

var ms = require('ms');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(xssFilter());
app.disable('x-powered-by');

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public/assets/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(session({
    secret: conf.session_secret || 'default=secret-Is-3asy',
    resave: true,
    saveUninitialized: true
}));

// var csrf = require('csurf');
// app.use(csrf());
app.use(helmet.hsts({
    maxAge: ms('1 year'),
    includeSubdomains: true
}));
app.use(helmet.frameguard('deny'));
app.use(helmet.noSniff());
// app.use(timeout(conf.timeout || '4s'));
app.use(flash());
//------------------------------------------------Start of passport
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

var localStrategy = require('passport-local');
var User = require('./models/User');
passport.use('login', new localStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: '没找到该用户!'});
        }
        user.checkPassword(password, function(err, isMatch) {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: '密码不正确' });
            }
        });
    });
}));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


//------------------------------------------------End __of passport

app.use(function(req, res, next) {
    res.locals.user = req.user;
    res.locals.error = req.flash('error');
    res.locals.danger = req.flash('danger');
    res.locals.warning = req.flash('warning');
    res.locals.info = req.flash('info');
    res.locals.success = req.flash('success');

    next();
});
//------------------------------------------------Start of routers

var index = require('./routes/index');
var about = require('./routes/about');
var agent = require('./routes/agent');
var identify = require('./routes/identify');
var compare = require('./routes/compare');
var admin = require('./routes/admin');
var verify = require('./routes/verify');
// var super = require('./routes/super');
var user = require('./routes/user');
var artwork = require('./routes/artwork');





app.use('/', index);
app.use('/about', about);
app.use('/agent', agent);
app.use('/identify', identify);
app.use('/compare', compare);
app.use('/admin', admin);
app.use('/verify', verify);
app.use('/user', user);
app.use('/artwork', artwork);

// app.use('/super', super);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//------------------------------------------------End __of routers

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) { //jshint ignore: line
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) { //jshint ignore: line
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
