var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var service = require('./services/service');
var session = require('client-sessions');


var app = express();
var compression = require('compression');
app.use(compression());
app.use(require('prerender-node').set('prerenderToken', 'zTnhoVfplm0FeP4hgDr2'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    cookieName: 'session',
    secret: 'utility_aid_admin',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    cookie: {
        //path: '/api', // cookie will only be sent to requests under '/api'
        //maxAge: 60000, // duration of the cookie in milliseconds, defaults to duration above
        ephemeral: true, // when true, cookie expires when the browser closes
        httpOnly: true, // when true, cookie is not accessible from javascript
        secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
    }
}));

app.use(function (req, res, next) {
    if (req.session && req.session.user) {
        db.collection('adminDetails', function (err, collection) {
            collection.findOne({userName: req.session.user.userName}, function (err, user) {
                if (user) {

                    req.user = user;
                    delete req.user.password; // delete the password from the session
                    req.session.user = user;  //refresh the session value
                    res.locals.user = user;
                    //console.log(req.session.user);
                }
                // finishing processing the middleware and run the route
                next();
            });
        });
    } else {
        next();
    }
});


function requireLogin(req, res, next) {
    next();
    /* console.log(req.user);
     if (!req.user) {
     res.redirect('/admin');
     } else {
     next();
     }*/
};
app.post('/getCaseStudyList', service.getCaseStudyList);
app.post('/getPartnerList', service.getPartnerList);
app.post('/getBlogList', service.getBlogList);
app.get('/getAuthorList', service.getAuthorList);
app.post('/sendRequestMail', service.sendRequestMail);

app.get('/admin/', function (req, res) {
    req.session.reset();
    res.sendfile('./public/indexAdmin.html');
});

app.get('/admin/*', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});


app.get('*', function (req, res) {
    res.sendfile('./public/index.html');
});
app.post('/login', service.login);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
