/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override')
// var sass = require('node-sass');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var mysql = require('mysql');

var config = require('./config.js');


var connection = mysql.createConnection({
  host     : config.host,
  user     : config.user,
  password : config.password,
  database : config.database
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  // User.findOne({ username: username }, function(err, user) {
  //   if (err) return done(err);
  //   if (!user) return done(null, false);
  //   user.comparePassword(password, function(err, isMatch) {
  //     if (err) return done(err);
  //     if (isMatch) return done(null, user);
  //     return done(null, false);
  //   });
  // });
}));

var app = express();
app.use(favicon(__dirname + '/public/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(sass.middleware({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Find post by id.
 *
 * @param {string} id
 * @returns {object} post
 */

app.get('/api/posts/:id', function(req, res, next) {
  // Post.findById(req.params.id, function(err, post) {
  //   if (err) return next(err);
  //   res.send({ post });
  // });
});

/**
 * Find all posts.
 *
 * @returns {object} post
 */

app.get('/api/posts', function(req, res, next) {
  // posts.find(function(err, posts) {
  //   if (err) return next(err);
  //   res.send({ posts: posts });
  // });
});

/**
 * Update post by id.
 *
 * @param {string} id
 * @returns {object} post
 */

app.put('/api/posts/:id', function(req, res, next) {
  // post.findByIdAndUpdate(req.params.id, req.body.post, function(err, post) {
  //   if (err) return next(err);
  //   res.send({ post: post });
  // });
});

/**
 * Create new post.
 *
 * @param {object} post
 * @returns {object} post
 */

app.post('/api/posts', function(req, res, next) {
  // var post = new post(req.body.post);
  // post.save(function(err) {
  //   if (err) return next(err);
  //   res.send({ post: post });
  // });
});

/**
 * Delete post by id.
 *
 * @param {string} id
 * @returns 200 OK
 */

app.delete('/api/posts/:id', function(req, res, next) {
  // post.findById(req.params.id).remove(function(err) {
  //   if (err) return next(err);
  //   res.send(200);
  // });
});

/**
 * POST /token
 * Sign in using email and password.
 * @param {string} username
 * @param {string} password
 */

app.post('/token', function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (err) return next(err);
    if (user) res.send({ access_token: user.token });
    else res.send(404, 'Incorrect username or password.');
  })(req, res, next);
});

/**
 * POST /signup
 * Create a new local account.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} confirmPassword
 */

app.post('/signup', function(req, res, next) {
  if (!req.body.username) {
    return res.send(400, 'Username cannot be blank.');
  }

  if (!req.body.email) {
    return res.send(400, 'Email cannot be blank.');
  }

  if (!req.body.password) {
    return res.send(400, 'Password cannot be blank.');
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.send(400, 'Passwords do not match.');
  }

  var user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };

  user.save(function(err) {
    if (err) return res.send(500, err.message);
    res.send(200);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send(err);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

module.exports = app;