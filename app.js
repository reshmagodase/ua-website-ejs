var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var service = require('./services/service');
var session = require('client-sessions');
var multer = require('multer');

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
    if (!req.user) {
        res.redirect('/admin');
    } else {
        next();
    }
};
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/utilityAid/tmp/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

var upMulter = multer({storage: storage});
app.post('/login', service.login);
app.post('/uploadImages', upMulter.array('file', 10), service.uploadImages);
app.get('/getImages', service.getImages);
app.get('/getAllImages', service.getAllImages);
app.post('/uploadAuthorImages', upMulter.array('file', 10), service.uploadAuthorImages);
app.get('/getAuthorImages', service.getAuthorImages);
app.post('/uploadPartnerImages', upMulter.array('file', 10), service.uploadPartnerImages);
app.get('/getPartnerImages', service.getPartnerImages);
app.post('/uploadPeopleImages', upMulter.array('file', 10), service.uploadPeopleImages);
app.get('/getPeopleImages', service.getPeopleImages);
app.post('/uploadBackgroundImages', upMulter.array('file', 10), service.addBackgroundImages);
app.get('/getBackgroundImages', service.getBackgroundImages);
app.get('/getAllBackgroundImages', service.getAllBackgroundImages);

app.post('/getCaseStudyList', service.getCaseStudyList);
app.post('/getPartnerList', service.getPartnerList);
app.post('/addPartners', service.addPartners);
app.post('/editPartners', service.editPartners);
app.post('/getPartnerDetails', service.getPartnerDetails);


app.post('/sendRequestMail', service.sendRequestMail);
app.post('/getCaseStudiesDetails', service.getCaseStudiesDetails);
app.post('/addCaseStudies', service.addCaseStudies);
app.post('/editCaseStudies', service.editCaseStudies);

app.post('/addBlog', service.addBlog);
app.post('/editBlog', service.editBlog);
app.post('/getBlogList', service.getBlogList);
app.post('/getBlogDetails', service.getBlogDetails);

app.post('/addAuthor', service.addAuthor);
app.post('/editAuthor', service.editAuthor);
app.post('/getAuthorList', service.getAuthorList);
app.post('/getAuthorDetails', service.getAuthorDetails);

app.post('/getProductList', service.getProductList);
app.post('/updateProductData', service.updateProductData);


app.post('/getContactData', service.getContactData);
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
