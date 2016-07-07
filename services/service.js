/**
 * Created by Radhika on 01-12-2015.
 */

var mongo = require('mongodb');
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
var fs = require("fs");
var GridStore = require('mongodb').GridStore;
var multer = require('multer');
var ObjectID = require('mongodb').ObjectID;
var sys = require('sys');
var exec = require('child_process').exec;
var im = require('imagemagick');
var Jimp = require("jimp");
var session = require('client-sessions');
//var lwip = require('lwip');

var nodemailer = require('nodemailer');


var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('utilityAid', server);

//Connect to Database

db.open(function (err, db) {
    if (!err) {
        console.log("Connected to 'utilityAid' database");
        db.collection('images', {strict: true}, function (err, collection) {
            if (err) {
                console.log("The 'images' collection doesn't exist. Creating it with sample data...");
            }
        });
    }
});


//Validate Login

exports.login = function (req, res) {


    var uName = req.body.username;
    var pwd = req.body.password;

    console.log('Retrieving data: ' + uName);
    db.collection('adminDetails', function (err, collection) {
        collection.findOne({'userName': uName}, function (err, item) {


            if (item === null) {
                var msg = {'error': 'Invalid Username'}
                var jm = JSON.stringify(msg);
                res.send(jm);
            }
            else {
                //console.log('else')
                if (item.password == pwd) {


                    //res.send(item);
                    var data = item;
                    req.session.user = data;
                    delete data.password;
                    data.status = 'success';
                    res.send(data);
                    //console.log(item);
                }
                else {
                    var msg = {'error': 'Invalid Password'}
                    var jm = JSON.stringify(msg);
                    res.send(jm);
                }
            }
        });
    });
}


var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'uaenergyandutilities@gmail.com',
        pass: 'utilityaid'
    }
});


/*Jimp.read("http://www.utility-aid.co.uk/utilityAid/backgroundImages/thumbnails/1450768341396-Resources.jpg", function (err, lenna) {
 if (err) throw err;
 lenna.resize(Jimp.AUTO,180)            // resize
 .quality(60)                 // set JPEG quality
 .write("./public/lena-small-bw.jpg"); // save
 });*/


//Services/
exports.getCaseStudyList = function (req, res) {

    db.collection('caseStudies', function (err, collection) {
        collection.find(req.body).sort({'createdDate': -1}).toArray(function (err, result) {

            if (err) {
                res.send({'status': 'error', 'message': 'An error has occurred'});
            }
            if (result == null) {
                res.send({'status': 'error', 'message': 'Data Not Found'});
            }
            if (result !== null) {
                res.send(result);
            }
        });
    });
}

exports.getPartnerList = function (req, res) {
    db.collection('partners', function (err, collection) {
        collection.find(req.body).sort({'createdDate': -1}).toArray(function (err, result) {

            if (err) {
                res.send({'status': 'error', 'message': 'An error has occurred'});
            }
            if (result == null) {
                res.send({'status': 'error', 'message': 'Data Not Found'});
            }
            if (result !== null) {
                res.send(result);
            }
        });
    });
}

exports.getBlogList = function (req, res) {
    db.collection('blog', function (err, collection) {
        collection.find(req.body).sort({'createdDate': -1}).toArray(function (err, result) {

            if (err) {
                res.send({'status': 'error', 'message': 'An error has occurred'});
            }
            if (result == null) {
                res.send({'status': 'error', 'message': 'Data Not Found'});
            }
            if (result !== null) {
                res.send(result);
            }
        });
    });
}

exports.getAuthorList = function (req, res) {
    console.log("jhjk")
    db.collection('author', function (err, collection) {
        collection.find({}).sort({'order_id': 1}).toArray(function (err, result) {
            if (err) {
                res.send({'status': 'error', 'message': 'An error has occurred'});
            }
            if (result == null) {
                res.send({'status': 'error', 'message': 'Data Not Found'});
            }
            if (result !== null) {
                res.send(result);
            }
        });
    });
}


exports.sendRequestMail = function (req, res) {
    var htmlFormat = '<table cellspacing="2" cellpadding="2">';
    if (req.body.title !=='' && req.body.title !==undefined) {
        htmlFormat += '<tr><td><b>Title</b> </td><td>' + req.body.title + '</td></tr>'
    }
    if (req.body.fullName !=='' && req.body.fullName !==undefined) {
        htmlFormat += '<tr><td><b>Full Name </b></td><td>' + req.body.fullName + '</td></tr>'
    }
    if (req.body.contact_number !=='' && req.body.contact_number !==undefined) {
        htmlFormat += '<tr><td><b>Contact Number </b></td><td>' + req.body.contact_number + '</td></tr>'
    }
    if (req.body.email !=='' && req.body.email !==undefined) {
        htmlFormat += '<tr><td><b>Email </b></td><td>' + req.body.email + '</td></tr>'
    }
    if (req.body.company_name !=='' && req.body.company_name !==undefined) {
        htmlFormat += '<tr><td><b>Company Name</b></td><td>' + req.body.company_name + '</td></tr>'
    }
    if (req.body.position !=='' && req.body.position !==undefined) {
        htmlFormat += '<tr><td><b>Position</b></td><td>' + req.body.position + '</td></tr>'
    }
    if (req.body.current_supplier !=='' && req.body.current_supplier !==undefined) {
        htmlFormat += '<tr><td><b>Current Supplier</b></td><td>' + req.body.current_supplier + '</td></tr>'
    }
    if (req.body.annual_energy_costs !=='' && req.body.annual_energy_costs !==undefined) {
        htmlFormat += '<tr><td><b>Annual Energy Cost</b></td><td>' + req.body.annual_energy_costs + '</td></tr>'
    }
    if (req.body.audit !=='' && req.body.audit !==undefined) {
        htmlFormat += '<tr><td><b>Do you require a FREE energy audit?</b></td><td>' + req.body.audit + '</td></tr>'
    }
    if (req.body.hearfrom !=='' && req.body.hearfrom !==undefined) {
        htmlFormat += '<tr><td><b>How did you hear about us?</b></td><td>' + req.body.hearfrom + '</td></tr>'
    }
    if (req.body.msg !=='' && req.body.msg !==undefined) {
        htmlFormat += '<tr><td><b>Enquiry</b></td><td>' + req.body.msg + '</td></tr>'
    }
    htmlFormat += '</table>'
    var mailOptions = {
        from: 'Utility Aid', // sender address
        to: 'enquiries@utility-aid.co.uk,gary@viva-worldwide.com,mdaly@utility-aid.com,WCampbell@utility-aid.co.uk', // list of receivers
        subject: 'Request A Free Energy Consultation', // Subject line
        text: '', // plaintext body
        html: htmlFormat
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

    });
    var info = req.body;
    info.createdDate = new Date().getTime().toString();

    db.collection('request', function (err, collection) {
        collection.insert(info, {safe: true}, function (err, result) {
            if (err) {
                res.send({'status': 'error', 'message': 'An error has occurred'});
            }
            else {
                console.log(result);
                res.send({'status': 'success', 'message': 'Data Added successfully'});
            }
        });
    });
}
