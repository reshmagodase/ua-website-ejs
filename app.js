var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var service = require('./services/service');
var session = require('client-sessions');

var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();


app.use(require('prerender-node').set('prerenderToken', 'IotwLbEkuBAtsinzzF6p'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(require('prerender-node').set('prerenderServiceUrl', 'http://localhost:3000/'));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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

app.post('/homepageText', service.homepageText);
app.get('/getHomePageText', service.getHomepageText);

app.post('/addCaseStudies', service.addCaseStudies);
app.post('/editCaseStudies', service.editCaseStudies);
app.get('/getCaseStudiesList', service.getCaseStudiesList);
app.get('/getActiveCaseStudiesList', service.getActiveCaseStudiesList);
app.post('/getCaseStudiesDetails', service.getCaseStudiesDetails);
app.post('/getCaseStudiesDetailsBySlug', service.getCaseStudiesDetailsBySlug);
app.get('/getCaseStudiesLastOne', service.getCaseStudiesLastOne);

app.post('/addPartners', service.addPartners);
app.post('/editPartners', service.editPartners);
app.get('/getPartnersList', service.getPartnersList);
app.post('/getPartnerDetails', service.getPartnerDetails);
app.get('/getActivePartnersList', service.getActivePartnersList);


app.post('/addPeople', service.addPeople);
app.post('/editPeople', service.editPeople);
app.get('/getPeopleList', service.getPeopleList);
app.post('/getPeopleDetails', service.getPeopleDetails);
app.post('/getAllPeopleDetails', service.getAllPeopleDetails);

app.post('/addAuthor', service.addAuthor);
app.post('/editAuthor', service.editAuthor);
app.get('/getAuthorList', service.getAuthorList);
app.post('/getAuthorDetails', service.getAuthorDetails);

app.post('/addDefault', service.addDefault);
app.post('/editDefault', service.editDefault);
app.get('/getDefaultList', service.getDefaultList);
app.post('/getDefaultDetails', service.getDefaultDetails);
app.post('/getDefaultDetailsBySlug', service.getDefaultDetailsBySlug);

app.post('/editAbout', service.editAbout);
app.get('/getAboutDetails', service.getAboutDetails);


app.post('/addBlog', service.addBlog);
app.post('/editBlog', service.editBlog);
app.get('/getBlogList', service.getBlogList);
app.get('/getActiveBlogList', service.getActiveBlogList);
app.post('/getBlogDetails', service.getBlogDetails);
app.post('/getArticleDetails', service.getArticleDetails);

app.post('/sendRequestMail', service.sendRequestMail);
app.post('/addSubscribers', service.addSubscribers);
//app.use('/', routes);
//app.use('/users', users);

function requireLogin(req, res, next) {
    console.log(req.user);
    if (!req.user) {
        res.redirect('/admin');
    } else {
        next();
    }
};


app.get('/about-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/add-author-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/add-blog-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/add-casestudy-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/add-partner-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/add-people-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/admin', function (req, res) {
    req.session.reset();
    res.sendfile('./public/indexAdmin.html');
});
app.get('/default-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/edit-author-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/edit-blog-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/edit-casestudy-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/edit-partner-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/edit-people-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/home-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/image-author-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/image-background-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/image-blog-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/image-partner-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/image-people-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/list-authors-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/list-blogs-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/list-casestudies-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/list-pages-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/list-partners-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});
app.get('/list-people-admin', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});


app.get('*', function (req, res) {
    res.sendfile('./public/index.html');
})
;

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
