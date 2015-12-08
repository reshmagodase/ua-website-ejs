var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var service = require('./services/service');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(require('prerender-node').set('prerenderToken', 'n4dsybLPw3LSlpktVQ7i'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/utilityAid/tmp/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

var upMulter = multer({storage: storage});

app.post('/uploadImages', upMulter.array('file', 10), service.uploadImage);
app.get('/getImages', service.getImages);
app.post('/homepageText', service.homepageText);
app.get('/getHomePageText', service.getHomepageText);
app.post('/addBackgroundImages', upMulter.array('file', 10), service.addBackgroundImages);
app.get('/getBackgroundImages', service.getBackgroundImages);


//app.use('/', routes);
//app.use('/users', users);
app.get('/about-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/add-author-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/add-blog-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/add-casestudy-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/add-partner-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/add-people-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/default', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/edit-author-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/edit-blog-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/edit-casestudy-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/edit-partner-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/edit-people-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/home-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/image-author-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/image-background-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/image-blog-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/image-partner-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/image-people-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/list-authors-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/list-blogs-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/list-casestudies-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/list-pages-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/list-partners-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/list-people-admin', function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});


app.get('*', function (req, res) {
    res.sendfile('./public/index.html');
});

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
