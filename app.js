var fs = require('fs');

process.on('uncaughtException', function (error) {
    fs.appendFile('debug.txt', "\n\r\n\r-------Error :------" + new Date() + "---" + error.stack, function (err) {
        if (err) throw err;
        console.log('The error was appended to file!', err);
    });
});

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var service = require('./services/service');
var session = require('client-sessions');
var multer = require('multer');
var multipartyMiddleware = require('connect-multiparty')();

var app = express();
var http = require('http');
var redirect = express();


var redirectServer = http.createServer(redirect);
redirect.use(function requireHTTPS(req, res, next) {
    if (!req.secure) {
        return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
});
redirectServer.listen(3007);


app.use(function (req, res, next) {
    /*    res.header("Access-Control-Allow-Origin", "https://uaenergy.co.uk");*/
    res.header("Access-Control-Allow-Origin", "*");
    /*    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');*/
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "content-type, accept");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, X-PINGOTHER, X-File-Name");
    res.header("Cache-Control", "no-cache, no-store, must-revalidate")
    res.header("Pragma", "no-cache")
    res.header("Expires", "0")
    if ('OPTIONS' == req.method) {
        res.writeHead('200');
        res.end();
    } else {
        next();
    }


});


var compression = require('compression');
app.use(compression());
var connect_s4a = require('connect-s4a');
var token = "3cc1f7ffb4800bfbb883377f0bb1ae7d";
app.use(require('prerender-node').set('prerenderToken', 'e0JuidllFGOBZKApP33v'));
// app.use(require('prerender-node'));
app.use(connect_s4a(token));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"), {
    maxAge: "1y"
}));
app.use(express.static(path.join(__dirname, 'public/switch/website')));
app.use(express.static(path.join(__dirname, 'public/switch/admin')));



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
            collection.findOne({
                userName: req.session.user.userName
            }, function (err, user) {
                if (user) {

                    req.user = user;
                    delete req.user.password; // delete the password from the session
                    req.session.user = user; //refresh the session value
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

var upMulter = multer({
    storage: storage
});
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
app.post('/sendQuestionMail', service.sendQuestionMail);
app.post('/sendQuestionMailUAEnergy', service.sendQuestionMailUAEnergy);
app.post('/getCaseStudiesDetails', service.getCaseStudiesDetails);
app.post('/addCaseStudies', service.addCaseStudies);
app.post('/editCaseStudies', service.editCaseStudies);

app.post('/addBlog', service.addBlog);
app.post('/editBlog', service.editBlog);
app.post('/getBlogList', service.getBlogList);
app.post('/getBlogDetails', service.getBlogDetails);

app.post('/addAuthor', service.addAuthor);
app.post('/editAuthor', service.editAuthor);
app.get('/getAuthorList', service.getAuthorList);
app.post('/getAuthorDetails', service.getAuthorDetails);

app.post('/getProductList', service.getProductList);
app.post('/getProductDetails', service.getProductDetails);
app.post('/updateProductData', service.updateProductData);
app.post('/insertProductData', service.insertProductData);

app.post('/getNewsList', service.getNewsList);
app.post('/addNews', service.addNews);
app.post('/editNews', service.editNews);
app.post('/getNewsDetails', service.getNewsDetails);
app.post("/uploadUANewsPhoto", upMulter.array('file', 10), service.uploadUANewsPhoto);
app.post("/uploadCV", upMulter.array('file', 10), service.uploadCV);
app.post('/addtestimonials', service.addtestimonials);
app.post('/getTestimonials', service.getTestimonials);
app.post('/getTestimonialDetails', service.getTestimonialDetails);
app.post('/edittestimonials', service.edittestimonials);

app.post('/getContactData', service.getContactData);
app.post('/sendCV', service.sendCV);
// church campaign
app.post('/addCampaignData', service.addchurchCampaignData);
app.post('/getCampaignData', service.getChurchCampaignData);
app.post('/addEmailCampaignData', service.addEmailCampaignData);
app.get('/addPardotEmail', service.addPardotEmail);
app.post('/getEmailByPardotId', service.getEmailByPardotId);
app.post('/sendLOAmail', service.sendLOAmail);
app.post('/sendLOA', service.sendLOA);
app.post('/changeAddtoCallStatusPardotEmail', service.changeAddtoCallStatusPardotEmail);
app.post('/uploadLOA', upMulter.array('file', 10), service.uploadLOA);
app.post('/saveLOA', service.saveLOA);
app.post('/getLOAData', service.getLOAData);
app.post('/getEmailBySalesforceId', service.getEmailBySalesforceId);
app.post('/sendGoogleAdContact', service.sendGoogleAdContact);
app.post('/sendLeadContact', service.sendLeadContact);

app.get('/admin/', function (req, res) {
    req.session.reset();
    res.sendfile('./public/indexAdmin.html');
});
app.get('/admin/*', requireLogin, function (req, res) {
    res.sendfile('./public/indexAdmin.html');
});

app.get('/switch/admin/*', function (req, res) {
    res.sendfile('./public/switch/admin/index.html');
});

app.get('/switch/*', function (req, res) {
    res.sendfile('./public/switch/website/index.html');
});


app.get('/baptist/*', function (req, res) {
    res.sendfile('./public/baptist/index.html');
});

app.get('/new/*', function (req, res) {
    res.sendfile('./public/new/index.html');
});

app.get('/newTest/*', function (req, res) {
    res.sendfile('./public/newTest/index.html');
});





app.get('*', function (req, res) {
    res.sendfile('./public/index.html');
});


/*=====================================
 * ua-energy API services starts here
 * =====================================*/

app.post('/uaenergyLogin', service.uaenergyLogin);
app.post('/uaenergyUpdateData', service.uaenergyUpdateData);
app.post('/uaenergyGetList', service.uaenergyGetList);
app.post('/uaenergyInsertData', service.uaenergyInsertData);
app.post('/uaenergyGetDetailsById', service.uaenergyGetDetailsById);
app.post('/deleteDataByID', service.deleteDataByID);
app.post('/uploadSupplierLogo', upMulter.array('file', 10), service.uploadSupplierLogo);
app.post("/uploadNewsPhoto", upMulter.array('file', 10), service.uploadNewsPhoto);


/*======================================
 * ua-energy API services ends here
 * =====================================*/
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