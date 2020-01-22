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
var multipartyMiddleware = require('connect-multiparty')();
//var lwip = require('lwip');

var nodemailer = require('nodemailer');


var server = new Server('localhost', 27017, { auto_reconnect: true });
db = new Db('utilityAid', server);

//Connect to Database

db.open(function (err, db) {
    if (!err) {
        console.log("Connected to 'utilityAid' database");
        db.collection('images', { strict: true }, function (err, collection) {
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
        collection.findOne({ 'userName': uName }, function (err, item) {


            if (item === null) {
                var msg = { 'error': 'Invalid Username' }
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
                    var msg = { 'error': 'Invalid Password' }
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


/*Jimp.read("https://www.utility-aid.co.uk/utilityAid/backgroundImages/thumbnails/1450768341396-Resources.jpg", function (err, lenna) {
 if (err) throw err;
 lenna.resize(Jimp.AUTO,180)            // resize
 .quality(60)                 // set JPEG quality
 .write("./public/lena-small-bw.jpg"); // save
 });*/

exports.uploadImages = function (req, res) {
    //console.log(req.files);
    var imageArray = [];
    var array = [];
    var count = 0;
    //console.log(req.files.length);
    var arr = parseInt(req.files.length);
    //console.log(arr.length);
    var reqImage = req.files.length - 1;

    for (var j = 0; j < arr; j++) {
        imageArray.push(req.files[j]);
    }


    for (var i = 0; i <= imageArray.length - 1; i++) {

        var np = './public/utilityAid/images/' + req.files[i].filename;
        var directoryPath = 'utilityAid/images/' + req.files[i].filename;
        var tmp = './public/utilityAid/tmp/' + req.files[i].filename;


        var imagePath = {};


        fs.rename('./public/utilityAid/tmp/' + req.files[i].filename, np, function (success) {

            //console.log(imageArray[0]);
            console.log("Image uploaded successfully");
        });

        //imageArray.push('utilityAid/images/' + req.files[i].filename);

        //delete imagePath._id;
        //console.log(imagePath)

        imagePath = {
            path: directoryPath,
            createdDate: new Date().getTime().toString()
        }
        array.push(imagePath);
    }

    console.log(array)

    db.collection('images', function (err, collection) {
        collection.insert(array, { safe: true }, function (err, result) {
            if (err) {
                /*res.send({
                 'status': 'error',
                 'message': 'An error has occurred'
                 });*/
                res.send(err);
            } else {
                if (count == 0) {
                    console.log('Success: ' + JSON.stringify(result));
                    res.send({ 'status': 'success', 'message': "Data Uploaded Successfully" });
                    count++;
                    console.log(count);
                    imagePath = {}
                }
                else if (count > 0) {
                    console.log(result);
                }

                //res.send(result);
            }
        });
    });

    //console.log(imageArray);
}
//Service to get images
exports.getImages = function (req, res) {
    db.collection('images', function (err, collection) {
        collection.find().limit(20).sort({ 'createdDate': -1 }).toArray(function (err, items) {

            if (err) {
                res.send({ 'error': 'An error has occurred' })
            }
            else if (items.length == 0) {
                var msg = [{
                    'status': 'error',
                    'message': 'Data not found'
                }]
                res.send(msg);
            }
            else if (items.length !== 0) {
                //console.log('else');
                items[0].status = 'success';
                res.send(items);
            }
        });
    });
}
exports.getAllImages = function (req, res) {
    db.collection('images', function (err, collection) {
        collection.find().sort({ 'createdDate': -1 }).toArray(function (err, items) {

            if (err) {
                res.send({ 'error': 'An error has occurred' })
            }
            else if (items.length == 0) {
                var msg = [{
                    'status': 'error',
                    'message': 'Data not found'
                }]
                res.send(msg);
            }
            else if (items.length !== 0) {
                //console.log('else');
                items[0].status = 'success';
                res.send(items);
            }
        });
    });
}
//Service to add background images
exports.addBackgroundImages = function (req, res) {
    var imageArray = [];
    var array = [];
    var count = 0;
    //console.log(req.files.length);
    var arr = parseInt(req.files.length);
    //console.log(arr.length);
    var reqImage = req.files.length - 1;

    for (var j = 0; j < arr; j++) {
        imageArray.push(req.files[j]);
    }

    for (var i = 0; i < imageArray.length; i++) {

        var np = './public/utilityAid/backgroundImages/' + req.files[i].filename;
        var directoryPath = 'utilityAid/backgroundImages/' + req.files[i].filename;
        var tmp = './public/utilityAid/tmp/' + req.files[i].filename;
        var dstPath = './public/utilityAid/backgroundImages/thumbnails/' + req.files[i].filename;
        var thumbDir = 'utilityAid/backgroundImages/thumbnails/' + req.files[i].filename;


        var imagePath = {};


        fs.rename('./public/utilityAid/tmp/' + req.files[i].filename, np, function (success) {


            Jimp.read(np, function (err, lenna) {
                if (err) throw err;
                lenna.resize(Jimp.AUTO, 180)
                    .quality(80) // resize
                    .write(dstPath)
            });


            //console.log(imageArray[0]);
            console.log("Image uploaded successfully");
        });


        //imageArray.push('utilityAid/images/' + req.files[i].filename);

        //delete imagePath._id;
        //console.log(imagePath)

        imagePath = {
            path: directoryPath,
            thumbPath: thumbDir,
            createdDate: new Date().getTime().toString()
        }
        array.push(imagePath);
    }

    console.log(array)

    db.collection('backgroundImages', function (err, collection) {
        collection.insert(array, { safe: true }, function (err, result) {
            if (err) {
                /*res.send({
                 'status': 'error',
                 'message': 'An error has occurred'
                 });*/
                res.send(err);
            } else {
                /*if (count == 0) {*/
                console.log('Success: ' + JSON.stringify(result));
                res.send({ 'status': 'success', 'message': "Data Uploaded Successfully" });
                count++;
                console.log(count);
                imagePath = {}
                /*}
                 else if (count > 0) {
                 console.log(result);
                 }*/

                //res.send(result);
            }
        });
    });
}

//Service to upload People images
exports.uploadPeopleImages = function (req, res) {
    //console.log(req.files);
    var imageArray = [];
    var array = [];
    var count = 0;
    //console.log(req.files.length);
    var arr = parseInt(req.files.length);
    //console.log(arr.length);
    var reqImage = req.files.length - 1;

    for (var j = 0; j < arr; j++) {
        imageArray.push(req.files[j]);
    }


    for (var i = 0; i <= imageArray.length - 1; i++) {

        var np = './public/utilityAid/peopleImages/' + req.files[i].filename;
        var directoryPath = 'utilityAid/peopleImages/' + req.files[i].filename;
        var tmp = './public/utilityAid/tmp/' + req.files[i].filename;


        var imagePath = {};


        fs.rename('./public/utilityAid/tmp/' + req.files[i].filename, np, function (success) {

            //console.log(imageArray[0]);
            console.log("Image uploaded successfully");
        });

        //imageArray.push('utilityAid/images/' + req.files[i].filename);

        //delete imagePath._id;
        //console.log(imagePath)

        imagePath = {
            path: directoryPath,
            createdDate: new Date().getTime().toString()
        }
        array.push(imagePath);
    }

    console.log(array)

    db.collection('peopleImages', function (err, collection) {
        collection.insert(array, { safe: true }, function (err, result) {
            if (err) {
                /*res.send({
                 'status': 'error',
                 'message': 'An error has occurred'
                 });*/
                res.send(err);
            } else {
                if (count == 0) {
                    console.log('Success: ' + JSON.stringify(result));
                    res.send({ 'status': 'success', 'message': "Data Uploaded Successfully" });
                    count++;
                    console.log(count);
                    imagePath = {}
                }
                else if (count > 0) {
                    console.log(result);
                }

                //res.send(result);
            }
        });
    });

    //console.log(imageArray);
}
//Service to get People images
exports.getPeopleImages = function (req, res) {
    db.collection('peopleImages', function (err, collection) {
        collection.find().sort({ 'createdDate': -1 }).toArray(function (err, items) {

            if (err) {
                res.send({ 'error': 'An error has occurred' })
            }
            else if (items.length == 0) {
                var msg = [{
                    'status': 'error',
                    'message': 'Data not found'
                }]
                res.send(msg);
            }
            else if (items.length !== 0) {
                //console.log('else');
                items[0].status = 'success';
                res.send(items);
            }
        });
    });
}
exports.uploadAuthorImages = function (req, res) {
    //console.log(req.files);
    var imageArray = [];
    var array = [];
    var count = 0;
    //console.log(req.files.length);
    var arr = parseInt(req.files.length);
    //console.log(arr.length);
    var reqImage = req.files.length - 1;

    for (var j = 0; j < arr; j++) {
        imageArray.push(req.files[j]);
    }


    for (var i = 0; i <= imageArray.length - 1; i++) {

        var np = './public/utilityAid/authorImages/' + req.files[i].filename;
        var directoryPath = 'utilityAid/authorImages/' + req.files[i].filename;
        var tmp = './public/utilityAid/tmp/' + req.files[i].filename;


        var imagePath = {};


        fs.rename('./public/utilityAid/tmp/' + req.files[i].filename, np, function (success) {

            //console.log(imageArray[0]);
            console.log("Image uploaded successfully");
        });

        //imageArray.push('utilityAid/images/' + req.files[i].filename);

        //delete imagePath._id;
        //console.log(imagePath)

        imagePath = {
            path: directoryPath,
            createdDate: new Date().getTime().toString()
        }
        array.push(imagePath);
    }

    console.log(array)

    db.collection('authorImages', function (err, collection) {
        collection.insert(array, { safe: true }, function (err, result) {
            if (err) {
                /*res.send({
                 'status': 'error',
                 'message': 'An error has occurred'
                 });*/
                res.send(err);
            } else {
                if (count == 0) {
                    console.log('Success: ' + JSON.stringify(result));
                    res.send({ 'status': 'success', 'message': "Data Uploaded Successfully" });
                    count++;
                    console.log(count);
                    imagePath = {}
                }
                else if (count > 0) {
                    console.log(result);
                }

                //res.send(result);
            }
        });
    });

    //console.log(imageArray);
}
//Service to get Author images
exports.getAuthorImages = function (req, res) {
    db.collection('authorImages', function (err, collection) {
        collection.find().sort({ 'createdDate': -1 }).toArray(function (err, items) {

            if (err) {
                res.send({ 'error': 'An error has occurred' })
            }
            else if (items.length == 0) {
                var msg = [{
                    'status': 'error',
                    'message': 'Data not found'
                }]
                res.send(msg);
            }
            else if (items.length !== 0) {
                //console.log('else');
                items[0].status = 'success';
                res.send(items);
            }
        });
    });
}


//Service to upload Partner images
exports.uploadPartnerImages = function (req, res) {
    //console.log(req.files);
    var imageArray = [];
    var array = [];
    var count = 0;
    //console.log(req.files.length);
    var arr = parseInt(req.files.length);
    //console.log(arr.length);
    var reqImage = req.files.length - 1;

    for (var j = 0; j < arr; j++) {
        imageArray.push(req.files[j]);
    }


    for (var i = 0; i <= imageArray.length - 1; i++) {

        var np = './public/utilityAid/partnerImages/' + req.files[i].filename;
        var directoryPath = 'utilityAid/partnerImages/' + req.files[i].filename;
        var tmp = './public/utilityAid/tmp/' + req.files[i].filename;


        var imagePath = {};


        fs.rename('./public/utilityAid/tmp/' + req.files[i].filename, np, function (success) {

            //console.log(imageArray[0]);
            console.log("Image uploaded successfully");
        });

        //imageArray.push('utilityAid/images/' + req.files[i].filename);

        //delete imagePath._id;
        //console.log(imagePath)

        imagePath = {
            path: directoryPath,
            createdDate: new Date().getTime().toString()
        }
        array.push(imagePath);
    }

    console.log(array)

    db.collection('partnerImages', function (err, collection) {
        collection.insert(array, { safe: true }, function (err, result) {
            if (err) {
                /*res.send({
                 'status': 'error',
                 'message': 'An error has occurred'
                 });*/
                res.send(err);
            } else {
                if (count == 0) {
                    console.log('Success: ' + JSON.stringify(result));
                    res.send({ 'status': 'success', 'message': "Data Uploaded Successfully" });
                    count++;
                    console.log(count);
                    imagePath = {}
                }
                else if (count > 0) {
                    console.log(result);
                }

                //res.send(result);
            }
        });
    });

    //console.log(imageArray);
}
//Service to get Partenr images
exports.getPartnerImages = function (req, res) {
    db.collection('partnerImages', function (err, collection) {
        collection.find().sort({ 'createdDate': -1 }).toArray(function (err, items) {

            if (err) {
                res.send({ 'error': 'An error has occurred' })
            }
            else if (items.length == 0) {
                var msg = [{
                    'status': 'error',
                    'message': 'Data not found'
                }]
                res.send(msg);
            }
            else if (items.length !== 0) {
                //console.log('else');
                items[0].status = 'success';
                res.send(items);
            }
        });
    });
}
//Service to get background images
exports.getBackgroundImages = function (req, res) {
    db.collection('backgroundImages', function (err, collection) {
        collection.find().limit(20).sort({ 'createdDate': -1 }).toArray(function (err, items) {

            if (err) {
                res.send({ 'error': 'An error has occurred' })
            }
            else if (items.length == 0) {
                var msg = [{
                    'status': 'error',
                    'message': 'Data not found'
                }]
                res.send(msg);
            }
            else if (items.length !== 0) {
                //console.log('else');
                items[0].status = 'success';
                res.send(items);
            }
        });
    });
}
exports.getAllBackgroundImages = function (req, res) {
    db.collection('backgroundImages', function (err, collection) {
        collection.find().sort({ 'createdDate': -1 }).toArray(function (err, items) {

            if (err) {
                res.send({ 'error': 'An error has occurred' })
            }
            else if (items.length == 0) {
                var msg = [{
                    'status': 'error',
                    'message': 'Data not found'
                }]
                res.send(msg);
            }
            else if (items.length !== 0) {
                //console.log('else');
                items[0].status = 'success';
                res.send(items);
            }
        });
    });
}


//Services/
exports.getCaseStudyList = function (req, res) {
    //console.log(req.body);
    db.collection('caseStudies', function (err, collection) {
        collection.find(req.body).toArray(function (err, result) {

            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            if (result == null) {
                res.send({ 'status': 'error', 'message': 'Data Not Found' });
            }
            if (result !== null) {

                res.send(result);
            }
        });
    });
}

exports.getPartnerList = function (req, res) {
    console.log("getpartnerlist called");
    db.collection('partners', function (err, collection) {
        collection.find(req.body).sort({ 'partner_name': 1 }).toArray(function (err, result) {

            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            if (result == null) {
                res.send({ 'status': 'error', 'message': 'Data Not Found' });
            }
            if (result !== null) {
                res.send(result);
            }
        });
    });
}
exports.addPartners = function (req, res) {
    var info = req.body;
    info.createdDate = new Date().getTime().toString();
    info.updatedDate = new Date().getTime().toString();

    db.collection('partners', function (err, collection) {
        collection.insert(info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send({ 'status': 'success', 'message': 'Data Added successfully' });
            }
        });
    });
}
exports.editPartners = function (req, res) {
    var info = req.body;
    var id = req.body.objectId;
    info.updatedDate = new Date().getTime().toString();

    delete info.objectId;
    db.collection('partners', function (err, collection) {
        collection.update({ '_id': new ObjectID(id) }, info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send({ 'status': 'success', 'message': 'Data Updated successfully' });
            }
        });
    });
}
//service to get partner details
exports.getPartnerDetails = function (req, res) {
    db.collection('partners', function (err, collection) {
        console.log(req.body.objectId);
        collection.findOne({ '_id': new ObjectID(req.body.objectId) }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            if (result == null) {
                res.send({ 'status': 'error', 'message': 'Data Not Found' });
            }
            if (result !== null) {
                res.send(result);
            }
        });
    });
}
//Service to add Blog
exports.addBlog = function (req, res) {
    var info = req.body;
    info.createdDate = new Date().getTime().toString();
    info.updatedDate = new Date().getTime().toString();

    db.collection('blog', function (err, collection) {
        collection.insert(info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send({ 'status': 'success', 'message': 'Data Added successfully' });
            }
        });
    });
}

exports.editBlog = function (req, res) {
    var info = req.body;
    var id = req.body.objectId;
    info.updatedDate = new Date().getTime().toString();

    delete info.objectId;
    db.collection('blog', function (err, collection) {
        collection.update({ '_id': new ObjectID(id) }, info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send({ 'status': 'success', 'message': 'Data Updated successfully' });
            }
        });
    });
}
exports.getBlogList = function (req, res) {
    db.collection('blog', function (err, collection) {
        collection.find(req.body).sort({ 'createdDate': -1 }).toArray(function (err, result) {

            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            if (result == null) {
                res.send({ 'status': 'error', 'message': 'Data Not Found' });
            }
            if (result !== null) {
                result.sort(function (a, b) {
                    console.log(new Date(b.publish_date_0) - new Date(a.publish_date_0))
                    return new Date(b.publish_date_0) - new Date(a.publish_date_0);

                });
                res.send(result);
            }
        });
    });
}
exports.getBlogDetails = function (req, res) {
    db.collection('blog', function (err, collection) {
        console.log(req.body.objectId);
        collection.findOne({ '_id': new ObjectID(req.body.objectId) }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            if (result == null) {
                res.send({ 'status': 'error', 'message': 'Data Not Found' });
            }
            if (result !== null) {
                res.send(result);
            }
        });
    });
}


exports.getNewsList = function (req, res) {
    db.collection('uaNews', function (err, collection) {
        collection.find(req.body).sort({ 'newsdate': -1 }).toArray(function (err, result) {
            console.log(result);
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            if (result == null || result.length == 0) {
                res.send({ 'status': 'error', 'message': 'Data Not Found' });
            }
            if (result !== null) {
                console.log(result);
                res.send(result);
            }
        });
    });
}
exports.addNews = function (req, res) {
    var info = req.body;
    info.createdDate = new Date().getTime().toString();
    info.updatedDate = new Date().getTime().toString();

    db.collection('uaNews', function (err, collection) {
        collection.insert(info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send({ 'status': 'success', 'message': 'Data Added successfully' });
            }
        });
    });
}

exports.editNews = function (req, res) {
    var info = req.body;
    var id = req.body.objectId;
    info.updatedDate = new Date().getTime().toString();

    delete info.objectId;
    db.collection('uaNews', function (err, collection) {
        collection.update({ '_id': new ObjectID(id) }, info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send({ 'status': 'success', 'message': 'Data Updated successfully' });
            }
        });
    });
}



exports.getNewsDetails = function (req, res) {
    db.collection('uaNews', function (err, collection) {
        var json = {};
        if (req.body.objectId) {
            json = { '_id': new ObjectID(req.body.objectId) };
        }
        else {
            var heading = req.body.heading;
            heading = heading.split('_').join(' ');
            heading = heading.split('*').join('?');
            json = { 'heading': heading };
        }
        collection.findOne(json, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            if (result == null) {
                res.send({ 'status': 'error', 'message': 'Data Not Found' });
            }
            if (result !== null) {
                res.send(result);
            }
        });
    });
}


exports.addAuthor = function (req, res) {
    var info = req.body;
    info.createdDate = new Date().getTime().toString();
    info.updatedDate = new Date().getTime().toString();

    db.collection('author', function (err, collection) {
        collection.insert(info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send({ 'status': 'success', 'message': 'Data Added successfully' });
            }
        });
    });
}

//Service to edit people
exports.editAuthor = function (req, res) {
    var info = req.body;
    var id = req.body.objectId;
    info.updatedDate = new Date().getTime().toString();

    delete info.objectId;
    db.collection('author', function (err, collection) {
        collection.update({ '_id': new ObjectID(id) }, info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send({ 'status': 'success', 'message': 'Data Updated successfully' });
            }
        });
    });
}
//service to get people details
exports.getAuthorDetails = function (req, res) {
    db.collection('author', function (err, collection) {
        console.log(req.body.objectId);
        collection.findOne({ '_id': new ObjectID(req.body.objectId) }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            if (result == null) {
                res.send({ 'status': 'error', 'message': 'Data Not Found' });
            }
            if (result !== null) {
                res.send(result);
            }
        });
    });
}
exports.getAuthorList = function (req, res) {
    db.collection('author', function (err, collection) {
        collection.find({}).sort({ 'order_id': 1 }).toArray(function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            if (result == null) {
                res.send({ 'status': 'error', 'message': 'Data Not Found' });
            }
            if (result !== null) {
                res.send(result);
            }
        });
    });
}


exports.sendRequestMail = function (req, res) {
    var htmlFormat = '<table cellspacing="2" cellpadding="2">';
    if (req.body.title !== '' && req.body.title !== undefined) {
        htmlFormat += '<tr><td><b>Title</b> </td><td>' + req.body.title + '</td></tr>'
    }
    if (req.body.fullName !== '' && req.body.fullName !== undefined) {
        htmlFormat += '<tr><td><b>Full Name </b></td><td>' + req.body.fullName + '</td></tr>'
    }
    if (req.body.contact_number !== '' && req.body.contact_number !== undefined) {
        htmlFormat += '<tr><td><b>Contact Number </b></td><td>' + req.body.contact_number + '</td></tr>'
    }
    if (req.body.email !== '' && req.body.email !== undefined) {
        htmlFormat += '<tr><td><b>Email </b></td><td>' + req.body.email + '</td></tr>'
    }
    if (req.body.company_name !== '' && req.body.company_name !== undefined) {
        htmlFormat += '<tr><td><b>Company Name</b></td><td>' + req.body.company_name + '</td></tr>'
    }
    if (req.body.position !== '' && req.body.position !== undefined) {
        htmlFormat += '<tr><td><b>Position</b></td><td>' + req.body.position + '</td></tr>'
    }
    if (req.body.current_supplier !== '' && req.body.current_supplier !== undefined) {
        htmlFormat += '<tr><td><b>Current Supplier</b></td><td>' + req.body.current_supplier + '</td></tr>'
    }
    if (req.body.annual_energy_costs !== '' && req.body.annual_energy_costs !== undefined) {
        htmlFormat += '<tr><td><b>Annual Energy Cost</b></td><td>' + req.body.annual_energy_costs + '</td></tr>'
    }
    if (req.body.audit !== '' && req.body.audit !== undefined) {
        htmlFormat += '<tr><td><b>Do you require a FREE energy audit?</b></td><td>' + req.body.audit + '</td></tr>'
    }
    if (req.body.hearfrom !== '' && req.body.hearfrom !== undefined) {
        htmlFormat += '<tr><td><b>How did you hear about us?</b></td><td>' + req.body.hearfrom + '</td></tr>'
    }
    if (req.body.msg !== '' && req.body.msg !== undefined) {
        htmlFormat += '<tr><td><b>Enquiry</b></td><td>' + req.body.msg + '</td></tr>'
    }
    htmlFormat += '</table>'


    var mailOptions = {
        from: 'Utility Aid', // sender address
        //to: 'enquiries@utility-aid.co.uk,gary@viva-worldwide.com,mdaly@utility-aid.com,WCampbell@utility-aid.co.uk', // list of receivers
        to: 'GilesHankinson@utility-aid.co.uk,njones@utility-aid.co.uk,alim@utility-aid.co.uk',
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
        collection.insert(info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send({ 'status': 'success', 'message': 'Data Added successfully' });
            }
        });
    });
}
exports.sendQuestionMail = function (req, res) {
    var htmlFormat = '<table cellspacing="2" cellpadding="2">';
    if (req.body.name !== '' && req.body.name !== undefined) {
        htmlFormat += '<tr><td><b>Name</b> </td><td>' + req.body.name + '</td></tr>'
    }
    if (req.body.email !== '' && req.body.email !== undefined) {
        htmlFormat += '<tr><td><b>Email </b></td><td>' + req.body.email + '</td></tr>'
    }
    if (req.body.phone !== '' && req.body.phone !== undefined) {
        htmlFormat += '<tr><td><b>Phone </b></td><td>' + req.body.phone + '</td></tr>'
    }
    if (req.body.questions !== '' && req.body.questions !== undefined) {
        htmlFormat += '<tr><td><b>Comments/Questions</b></td><td>' + req.body.questions + '</td></tr>'
    }

    htmlFormat += '</table>'
    var mailOptions = {
        from: 'Utility Aid', // sender address
        //to: 'enquiries@utility-aid.co.uk,gary@viva-worldwide.com,mdaly@utility-aid.com,WCampbell@utility-aid.co.uk', // list of receivers
        to: 'GilesHankinson@utility-aid.co.uk,dnyaneshwar@scriptlanes.com,njones@utility-aid.co.uk,ALim@utility-aid.co.uk',
        subject: 'Ask a Question', // Subject line
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
        collection.insert(info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send({ 'status': 'success', 'message': 'Data Added successfully' });
            }
        });
    });
}
exports.sendQuestionMailUAEnergy = function (req, res) {
    var htmlFormat = '<table cellspacing="2" cellpadding="2">';
    if (req.body.name !== '' && req.body.name !== undefined) {
        htmlFormat += '<tr><td><b>Name</b> </td><td>' + req.body.name + '</td></tr>'
    }
    if (req.body.email !== '' && req.body.email !== undefined) {
        htmlFormat += '<tr><td><b>Email </b></td><td>' + req.body.email + '</td></tr>'
    }
    if (req.body.phone !== '' && req.body.phone !== undefined) {
        htmlFormat += '<tr><td><b>Phone </b></td><td>' + req.body.phone + '</td></tr>'
    }
    if (req.body.questions !== '' && req.body.questions !== undefined) {
        htmlFormat += '<tr><td><b>Comments/Questions</b></td><td>' + req.body.questions + '</td></tr>'
    }

    htmlFormat += '</table>'

    var mailOptions = {
        from: 'UA Energy', // sender address
        //to: 'enquiries@utility-aid.co.uk,gary@viva-worldwide.com,mdaly@utility-aid.com,WCampbell@utility-aid.co.uk', // list of receivers
        to: 'GilesHankinson@utility-aid.co.uk,dnyaneshwar@scriptlanes.com,njones@utility-aid.co.uk,ALim@utility-aid.co.uk',
        subject: 'Ask a Question', // Subject line
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
        collection.insert(info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send({ 'status': 'success', 'message': 'Data Added successfully' });
            }
        });
    });
}
exports.getCaseStudiesDetails = function (req, res) {
    db.collection('caseStudies', function (err, collection) {
        console.log(req.body.objectId);
        collection.findOne({ '_id': new ObjectID(req.body.objectId) }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            if (result == null) {
                res.send({ 'status': 'error', 'message': 'Data Not Found' });
            }
            if (result !== null) {
                res.send(result);
            }
        });
    });
}

exports.addCaseStudies = function (req, res) {
    var info = req.body;
    info.createdDate = new Date().getTime().toString();
    info.updatedDate = new Date().getTime().toString();
    delete info.objectId;

    db.collection('caseStudies', function (err, collection) {
        collection.insert(info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send({ 'status': 'success', 'message': 'Data Added successfully' });
            }
        });
    });
}

exports.editCaseStudies = function (req, res) {
    console.log(req.body);
    var info = req.body;
    var id = req.body.objectId;
    console.log('objectid', id);
    info.updatedDate = new Date().getTime().toString();

    delete info.objectId;
    db.collection('caseStudies', function (err, collection) {
        collection.update({ '_id': new ObjectID(id) }, info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send({ 'status': 'success', 'message': 'Data Updated successfully' });
            }
        });
    });
}

exports.getProductList = function (req, res) {
    var collection = req.body.collection;
    db.collection(collection, function (err, collection) {
        collection.find({}).toArray(function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            if (result == null) {
                res.send({ 'status': 'error', 'message': 'Data Not Found' });
            }
            if (result !== null) {
                console.log(result);
                var data = result;
                res.send(data);
            }

        });
    });
}

exports.insertProductData = function (req, res) {
    var info = req.body;
    info.createdDate = new Date().getTime().toString();
    info.updatedDate = new Date().getTime().toString();

    db.collection("products", function (err, collection) {
        collection.insert(info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send({ 'status': 'success', 'message': 'Data Added successfully' });
            }
        });
    });
}
exports.updateProductData = function (req, res) {
    var info = req.body;
    var id = req.body.objectId;
    console.log(id);
    var collection = req.body.collection;
    info.updatedDate = new Date().getTime().toString();

    delete info.objectId;
    db.collection(collection, function (err, collection) {
        collection.update({ '_id': new ObjectID(id) }, info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send({ 'status': 'success', 'message': 'Data Updated successfully' });
            }
        });
    });
}


exports.getContactData = function (req, res) {
    db.collection('contact', function (err, collection) {
        console.log(req.body.objectId);
        collection.findOne({ '_id': new ObjectID(req.body.objectId) }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            if (result == null) {
                res.send({ 'status': 'error', 'message': 'Data Not Found' });
            }
            if (result !== null) {
                res.send(result);
            }
        });
    });
}

exports.getProductDetails = function (req, res) {
    db.collection('products', function (err, collection) {
        console.log(req.body.objectId);
        collection.findOne({ '_id': new ObjectID(req.body.objectId) }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            if (result == null) {
                res.send({ 'status': 'error', 'message': 'Data Not Found' });
            }
            if (result !== null) {
                res.send(result);
            }
        });
    });
}
exports.uploadUANewsPhoto = function (req, res) {

    var imageArray = [];
    var array = [];
    var arr = parseInt(req.files.length);
    for (var j = 0; j < arr; j++) {
        imageArray.push(req.files[j]);
    }
    for (var i = 0; i <= imageArray.length - 1; i++) {
        var np = './public/utilityAid/news/' + req.files[i].filename;
        var directoryPath = 'utilityAid/news/' + req.files[i].filename;
        var tmp = './public/utilityAid/tmp/' + req.files[i].filename;
        var imagePath = {};
        fs.rename('./public/utilityAid/tmp/' + req.files[i].filename, np, function (success) {
            console.log("File uploaded successfully");
        });
        imagePath = {
            path: directoryPath,
            createdDate: new Date().getTime().toString()
        };
        array.push(imagePath);
        //res.header('Access-Control-Allow-Origin', '*');
        // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        //res.header('Access-Control-Allow-Headers', 'Content-Type');
        //res.code(200);
        res.send(directoryPath);
    }
};


/*=================================================
 * ua-energy API calls goes here
 * =================================================*/

/*login API service for ua-energy*/
exports.uaenergyLogin = function (req, res) {

    var uName = req.body.username;
    var pwd = req.body.password;

    console.log('Retrieving data: ' + uName);
    db.collection('uaenergyAdmin', function (err, collection) {
        collection.findOne({ 'userName': uName }, function (err, item) {
            if (item === null) {
                var msg = { 'error': 'Invalid Username' }
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
                    var msg = { 'error': 'Invalid Password' }
                    var jm = JSON.stringify(msg);
                    res.send(jm);
                }
            }
        });
    });
};

/*update data in the given collection*/
exports.uaenergyUpdateData = function (req, res) {
    var info = req.body;
    var id = req.body.objectId;
    console.log(id);
    var collection = req.body.collection;
    info.updatedDate = new Date().getTime().toString();

    delete info.objectId;
    db.collection(collection, function (err, collection) {
        collection.update({ '_id': new ObjectID(id) }, info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send({ 'status': 'success', 'message': 'Data Updated successfully' });
            }
        });
    });
};

/*get all data from given collection*/
exports.uaenergyGetList = function (req, res) {
    var collection = req.body.collection;
    db.collection(collection, function (err, collection) {
        collection.find({}).toArray(function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            if (result == null) {
                res.send({ 'status': 'error', 'message': 'Data Not Found' });
            }
            if (result !== null) {
                console.log(result);
                var data = result;
                res.send(data);
            }

        });
    });
};

/*insert data into the given collection*/
exports.uaenergyInsertData = function (req, res) {

    var info = req.body;
    console.log(info);
    info.createdDate = new Date().getTime().toString();
    info.updatedDate = new Date().getTime().toString();
    var collection = req.body.collection;
    db.collection(collection, function (err, collection) {
        collection.insert(info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send(result);
            }
        });
    });
};

/*get details of given specific id*/
exports.uaenergyGetDetailsById = function (req, res) {
    var id = req.body.objectId;
    var collection = req.body.collection;
    db.collection(collection, function (err, collection) {
        collection.find({ '_id': new ObjectID(id) }).toArray(function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            if (result == null) {
                res.send({ 'status': 'error', 'message': 'Data Not Found' });
            }
            if (result !== null) {
                console.log(result);
                var data = result[0];
                res.send(data);
            }

        });
    });
};

/*delete data by id*/
exports.deleteDataByID = function (req, res) {
    var id = req.body.objectId;
    var collection = req.body.collection;
    db.collection(collection, function (err, collection) {
        collection.remove({ '_id': new ObjectID(id) })(function (err) {
            res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });

        });
    });
}

/*upload supplier logo*/
exports.uploadSupplierLogo = function (req, res) {
    var imageArray = [];
    var array = [];
    var arr = parseInt(req.files.length);
    for (var j = 0; j < arr; j++) {
        imageArray.push(req.files[j]);
    }
    for (var i = 0; i <= imageArray.length - 1; i++) {
        var np = './public/uaenergy/supplierLogo/' + req.files[i].filename;
        var directoryPath = 'uaenergy/supplierLogo/' + req.files[i].filename;
        var tmp = './public/utilityAid/tmp/' + req.files[i].filename;
        var imagePath = {};
        fs.rename('./public/utilityAid/tmp/' + req.files[i].filename, np, function (success) {
            console.log("File uploaded successfully");
        });
        imagePath = {
            path: directoryPath,
            createdDate: new Date().getTime().toString()
        };
        array.push(imagePath);
        res.send(directoryPath);
    }
};

/*upload news photo*/
exports.uploadNewsPhoto = function (req, res) {

    var imageArray = [];
    var array = [];
    var arr = parseInt(req.files.length);
    for (var j = 0; j < arr; j++) {
        imageArray.push(req.files[j]);
    }
    for (var i = 0; i <= imageArray.length - 1; i++) {
        var np = './public/uaenergy/news/' + req.files[i].filename;
        var directoryPath = 'uaenergy/news/' + req.files[i].filename;
        var tmp = './public/utilityAid/tmp/' + req.files[i].filename;
        var imagePath = {};
        fs.rename('./public/utilityAid/tmp/' + req.files[i].filename, np, function (success) {
            console.log("File uploaded successfully");
        });
        imagePath = {
            path: directoryPath,
            createdDate: new Date().getTime().toString()
        };
        array.push(imagePath);
        //res.header('Access-Control-Allow-Origin', '*');
        // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        //res.header('Access-Control-Allow-Headers', 'Content-Type');
        //res.code(200);
        res.send(directoryPath);
    }
};

/* Added by dnyanesh */
exports.sendCV = function (req, res) {
    console.log(req.body);
    var reciepients;
    if (req.body.location == "Norwich") {
        reciepients = 'njones@utility-aid.co.uk,gileshankinson@utility-aid.co.uk,alim@utility-aid.co.uk'
    }

    if (req.body.location == "Glasgow") {
        reciepients = 'LDuffy@utility-aid.net,alim@utility-aid.co.uk'
        // reciepients = 'dnyaneshwar@scriptlanes.com'
    }

    console.log('reciepients', reciepients);
    mailOptions = {
        from: "cv@utility-aid.com",
        to: reciepients,
        subject: "New CV",
        html: "<p> Name: <b>" + req.body.name + "</b></p><p> email: <b>" + req.body.cvemail + "</b></p>",
        attachments: [{
            filename: req.body.filename,
            path: __dirname + '/' + req.body.cvpath
            // path: 'https://en.defacto.nl/images/social/demo-1200x630-b3c5c9a1.png'
        }]
    };
    console.log('mailOptions', mailOptions);
    transporter.sendMail(mailOptions, function (err) {
        if (err) {
            console.log(err);
            res.status(500).end();
        }
        console.log('Mail sent successfully');
        res.status(200).end()
    });
};
exports.uploadCV = function (req, res) {

    var imageArray = [];
    var array = [];
    var arr = parseInt(req.files.length);
    console.log('req.files', req.files);
    for (var j = 0; j < arr; j++) {
        imageArray.push(req.files[j]);
    }
    for (var i = 0; i <= imageArray.length - 1; i++) {
        var np = /* './public/utilityAid/cv/' */'./services/cv/' + req.files[i].filename;
        var directoryPath = /* 'utilityAid/cv/' + */ 'cv/' + req.files[i].filename;
        var tmp = './public/utilityAid/tmp/' + req.files[i].filename;
        var imagePath = {};
        fs.rename('./public/utilityAid/tmp/' + req.files[i].filename, np, function (success) {
            console.log("File uploaded successfully");
        });
        imagePath = {
            path: directoryPath,
            createdDate: new Date().getTime().toString(),
            name: req.files[i].filename
        };
        array.push(imagePath);
        //res.header('Access-Control-Allow-Origin', '*');
        // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        //res.header('Access-Control-Allow-Headers', 'Content-Type');
        //res.code(200);
        res.send(imagePath);
    }
};

// add church campaign data

exports.addchurchCampaignData = function (req, res) {
    console.log('in campaign', req.body);
    var info = req.body;
    info.createdDate = new Date();
    info.updatedDate = new Date();
    db.collection('churchcampaign', function (err, collection) {
        collection.insert(info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send({code: 200, result:result});
            }
        });
    });
}

exports.getChurchCampaignData = function (req, res) {
    db.collection('churchcampaign', function (err, collection) {
        collection.find({}).toArray(function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            if (result == null) {
                res.send({ 'status': 'error', 'message': 'Data Not Found' });
            }
            if (result !== null) {
                console.log(result);
                var data = result;
                res.send(data);
            }

        });
    });
}

exports.addEmailCampaignData = function(req, res) {
    console.log('in email campaign', req.body);
    var info = req.body;
    info.createdDate = new Date();
    info.updatedDate = new Date();
    db.collection('emailcampaign', function (err, collection) {
        collection.insert(info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send({code: 200, result:result});
            }
        });
    });
}

exports.getEmailByPardotId = function(req, res) {
    db.collection('emailwithpardot', function (err, collection) {
        collection.find({ID: req.body.pardotId}).toArray(function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            if (result == null) {
                res.send({ 'status': 'error', 'message': 'Data Not Found' });
            }
            if (result !== null) {
                console.log(result);
                var data = result;
                res.send(data);
            }

        });
    });
}

var pardotJSON = [
        {
            "ID": "00Q4G000019KdyiUAC",
            "Email": "adminstaff@trinitybaptist.org.uk"
        },
        {
            "ID": "00Q4G000019KdysUAC",
            "Email": "info@ccb.org.uk"
        },
        {
            "ID": "00Q4G000019KdytUAC",
            "Email": "info@kingchruchlondon.org"
        },
        {
            "ID": "00Q4G000019KdyuUAC",
            "Email": "info@streathambaptist.com"
        },
        {
            "ID": "00Q4G000019KdyvUAC",
            "Email": "sheila.lane@frintonfree.com"
        },
        {
            "ID": "00Q4G000019KdywUAC",
            "Email": "graham.ball@guildfordbaptist.org"
        },
        {
            "ID": "00Q4G000019KdyxUAC",
            "Email": "john@scbc.org.uk"
        },
        {
            "ID": "00Q4G000019KdyyUAC",
            "Email": "info@centralbaptistchelmsford.org"
        },
        {
            "ID": "00Q4G000019KdyzUAC",
            "Email": "sheila@edmontonbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Kdz0UAC",
            "Email": "colin@victoriabaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Kdz1UAC",
            "Email": "info@ChichesterBaptistChurch.com"
        },
        {
            "ID": "00Q4G000019Kdz2UAC",
            "Email": "office@stocktonbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Kdz3UAC",
            "Email": "mat@uptonvale.org.uk"
        },
        {
            "ID": "00Q4G000019Kdz4UAC",
            "Email": "stewart@wycliffe-church.org.uk"
        },
        {
            "ID": "00Q4G000019Kdz5UAC",
            "Email": "tomkennar@gmail.com"
        },
        {
            "ID": "00Q4G000019Kdz6UAC",
            "Email": "stevew@hrbc.org.uk"
        },
        {
            "ID": "00Q4G000019Kdz7UAC",
            "Email": "csmbc@btconnect.com"
        },
        {
            "ID": "00Q4G000019Kdz8UAC",
            "Email": "sarah.brown@stbbc.org.uk"
        },
        {
            "ID": "00Q4G000019Kdz9UAC",
            "Email": "andyg@testwoodbaptist.org"
        },
        {
            "ID": "00Q4G000019KdzAUAS",
            "Email": "office@allnationsbedford.org"
        },
        {
            "ID": "00Q4G000019KdzBUAS",
            "Email": "office@cirencester-baptist.org"
        },
        {
            "ID": "00Q4G000019KdzCUAS",
            "Email": "chris@finchamstead.com"
        },
        {
            "ID": "00Q4G000019KdzDUAS",
            "Email": "sonya@mutleybaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019KdzEUAS",
            "Email": "andy.collins@hertfordbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019KdzFUAS",
            "Email": "sandra@westcroydon.com"
        },
        {
            "ID": "00Q4G000019KdzGUAS",
            "Email": "kate.churchhill@spbc.org.uk"
        },
        {
            "ID": "00Q4G000019KdzHUAS",
            "Email": "tim.breed@stpbaptistchurch.org"
        },
        {
            "ID": "00Q4G000019KdzIUAS",
            "Email": "reception@rayleighbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019KdzJUAS",
            "Email": "accounts@wbconline.co.uk"
        },
        {
            "ID": "00Q4G000019KdzKUAS",
            "Email": "admin@waypointchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KdzLUAS",
            "Email": "treasureer@qrbc.org.uk"
        },
        {
            "ID": "00Q4G000019KdzMUAS",
            "Email": "sarahhayes@altrinchambaptist.org"
        },
        {
            "ID": "00Q4G000019KdzNUAS",
            "Email": "sarah.taylor@northchurch.com"
        },
        {
            "ID": "00Q4G000019KdzOUAS",
            "Email": "suebbc@outlook.com"
        },
        {
            "ID": "00Q4G000019KdzPUAS",
            "Email": "Treasureer@stortfordbaptistchurch.org"
        },
        {
            "ID": "00Q4G000019KdzQUAS",
            "Email": "moortown.baptist@btconnect.com"
        },
        {
            "ID": "00Q4G000019KdzRUAS",
            "Email": "andrew.middleton@crawleybaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KdzSUAS",
            "Email": "info@nlbc.org.uk"
        },
        {
            "ID": "00Q4G000019KdzTUAS",
            "Email": "office@farnhambaptist.org"
        },
        {
            "ID": "00Q4G000019KdzUUAS",
            "Email": "info@wellsplace.org.uk"
        },
        {
            "ID": "00Q4G000019KdzVUAS",
            "Email": "info@reigatebaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KdzWUAS",
            "Email": "admin@billericaybaptist.org.uk"
        },
        {
            "ID": "00Q4G000019KdzXUAS",
            "Email": "adrian.knolloth@stopsley.net"
        },
        {
            "ID": "00Q4G000019KdzYUAS",
            "Email": "kirstinhh@bookhambaptist.org"
        },
        {
            "ID": "00Q4G000019KdzZUAS",
            "Email": "office@bromleybaptist.com"
        },
        {
            "ID": "00Q4G000019KdzaUAC",
            "Email": "matt.trendall.mk@gmail.com"
        },
        {
            "ID": "00Q4G000019KdzbUAC",
            "Email": "stepheni@lifecentremcr.com"
        },
        {
            "ID": "00Q4G000019KdzcUAC",
            "Email": "info@burlington.church"
        },
        {
            "ID": "00Q4G000019KdzdUAC",
            "Email": "julie.eady@lrbc.org.uk"
        },
        {
            "ID": "00Q4G000019KdzeUAC",
            "Email": "office@milton-baptist.org.uk"
        },
        {
            "ID": "00Q4G000019KdzfUAC",
            "Email": "centremanager@ararat.org.uk"
        },
        {
            "ID": "00Q4G000019KdzgUAC",
            "Email": "office@colchesterbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019KdzhUAC",
            "Email": "account@sbc-chruch.org.uk"
        },
        {
            "ID": "00Q4G000019KdziUAC",
            "Email": "john.wheeler@clevedonbaptistchurch.org"
        },
        {
            "ID": "00Q4G000019KdzjUAC",
            "Email": "churchoffice@rlbv.org.uk"
        },
        {
            "ID": "00Q4G000019KdzkUAC",
            "Email": "tbc-admin@tbc.org.uk"
        },
        {
            "ID": "00Q4G000019KdzlUAC",
            "Email": "office@wwwsba.org.uk"
        },
        {
            "ID": "00Q4G000019KdzmUAC",
            "Email": "office@shirleybaptist.org.uk"
        },
        {
            "ID": "00Q4G000019KdznUAC",
            "Email": "office@twbc.org.uk"
        },
        {
            "ID": "00Q4G000019KdzoUAC",
            "Email": "info@gatewaychurch.me"
        },
        {
            "ID": "00Q4G000019KdzpUAC",
            "Email": "office@cs-bc.org.uk"
        },
        {
            "ID": "00Q4G000019KdzqUAC",
            "Email": "office@woodleybc.org"
        },
        {
            "ID": "00Q4G000019KdzrUAC",
            "Email": "sue.norton@bgbc.co.uk"
        },
        {
            "ID": "00Q4G000019KdzsUAC",
            "Email": "treasureer@derehambaptist.org"
        },
        {
            "ID": "00Q4G000019KdztUAC",
            "Email": "admin@crbe.org.uk"
        },
        {
            "ID": "00Q4G000019KdzuUAC",
            "Email": "Treasureer@coshambaptist.org"
        },
        {
            "ID": "00Q4G000019KdzvUAC",
            "Email": "treasureer@ashleybaptist.co.uk"
        },
        {
            "ID": "00Q4G000019KdzwUAC",
            "Email": "Dawn.doidge@hopebaptist.co.uk"
        },
        {
            "ID": "00Q4G000019KdzxUAC",
            "Email": "michelle@wokinghambaptist.org.uk"
        },
        {
            "ID": "00Q4G000019KdzyUAC",
            "Email": "sue@fleetbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019KdzzUAC",
            "Email": "info@christchurchwgc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke00UAC",
            "Email": "office@willesboroughbaptist.church"
        },
        {
            "ID": "00Q4G000019Ke01UAC",
            "Email": "office@fbcbristol.org.uk"
        },
        {
            "ID": "00Q4G000019Ke02UAC",
            "Email": "Office@rugbybaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke03UAC",
            "Email": "kathleenmaddox@selsdonbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke04UAC",
            "Email": "treasurer@iwell.org.uk"
        },
        {
            "ID": "00Q4G000019Ke05UAC",
            "Email": "OFFICE@CHRUCHONTHEHEATH.ORG.UK"
        },
        {
            "ID": "00Q4G000019Ke06UAC",
            "Email": "office@mnmbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke07UAC",
            "Email": "wendy@hbc-oxford.org.uk"
        },
        {
            "ID": "00Q4G000019Ke08UAC",
            "Email": "treasurer@norwichcentral.org"
        },
        {
            "ID": "00Q4G000019Ke09UAC",
            "Email": "june@creechbc.co.uk"
        },
        {
            "ID": "00Q4G000019Ke0AUAS",
            "Email": "admin@enfieldbaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke0BUAS",
            "Email": "office@minehead-baptist.com"
        },
        {
            "ID": "00Q4G000019Ke0CUAS",
            "Email": "andrew@onechurch.org"
        },
        {
            "ID": "00Q4G000019Ke0DUAS",
            "Email": "office@godmanchesterbaptist.org"
        },
        {
            "ID": "00Q4G000019Ke0EUAS",
            "Email": "stephen@canterburybaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke0FUAS",
            "Email": "fiance@bromhan.org"
        },
        {
            "ID": "00Q4G000019Ke0GUAS",
            "Email": "secretary.croftonbc@googlemail.com"
        },
        {
            "ID": "00Q4G000019Ke0HUAS",
            "Email": "trevoratkinson@seaforbaptistchurch.org"
        },
        {
            "ID": "00Q4G000019Ke0IUAS",
            "Email": "BENJIE@CENTRALBAPTIST.ORG.UK"
        },
        {
            "ID": "00Q4G000019Ke0JUAS",
            "Email": "administrator@tauntonbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke0KUAS",
            "Email": "Fiance@newburybaptistchurch.org"
        },
        {
            "ID": "00Q4G000019Ke0LUAS",
            "Email": "shelley@heatonbaptist.org"
        },
        {
            "ID": "00Q4G000019Ke0MUAS",
            "Email": "simonlowson@cornerstoneevents.co.uk"
        },
        {
            "ID": "00Q4G000019Ke0NUAS",
            "Email": "office@counterslip.org"
        },
        {
            "ID": "00Q4G000019Ke0OUAS",
            "Email": "secretary.campdenbc@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke0PUAS",
            "Email": "office@battlebaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke0QUAS",
            "Email": "CHURCH@BLOOMSBURY.ORG.UK"
        },
        {
            "ID": "00Q4G000019Ke0RUAS",
            "Email": "SIMON@BLOOMSBURY.ORG.UK"
        },
        {
            "ID": "00Q4G000019Ke0SUAS",
            "Email": "info@praisegatetemple.org"
        },
        {
            "ID": "00Q4G000019Ke0TUAS",
            "Email": "graham@gillinghamcommunitychurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke0UUAS",
            "Email": "corradini63@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke0VUAS",
            "Email": "admin@mrbc.org.ik"
        },
        {
            "ID": "00Q4G000019Ke0WUAS",
            "Email": "treasurer@herefordbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke0XUAS",
            "Email": "tabbaptist@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke0YUAS",
            "Email": "liz@southcourt.org"
        },
        {
            "ID": "00Q4G000019Ke0ZUAS",
            "Email": "treasurer@bethelcardiff.org.uk"
        },
        {
            "ID": "00Q4G000019Ke0aUAC",
            "Email": "office@londonroad.org.uk"
        },
        {
            "ID": "00Q4G000019Ke0bUAC",
            "Email": "OFFICE@STONYSTRATFORDCOMMUNITYCHURCH.CO.UK"
        },
        {
            "ID": "00Q4G000019Ke0cUAC",
            "Email": "office@lbcweb.org.uk"
        },
        {
            "ID": "00Q4G000019Ke0dUAC",
            "Email": "office@fullerbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke0eUAC",
            "Email": "OFFICEMANGER@TEIGNMOUTHBAPTIST.ORG"
        },
        {
            "ID": "00Q4G000019Ke0fUAC",
            "Email": "stuart.grant@wbbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke0gUAC",
            "Email": "admin@ampthillbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke0hUAC",
            "Email": "office@ampthillbapsistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeGFUA0",
            "Email": "info@grimsbybaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke0iUAC",
            "Email": "office@lymingtonbaptist.org"
        },
        {
            "ID": "00Q4G000019Ke0jUAC",
            "Email": "info@thebarn.org.uk"
        },
        {
            "ID": "00Q4G000019Ke0kUAC",
            "Email": "office@newlifeworthing.com"
        },
        {
            "ID": "00Q4G000019Ke0lUAC",
            "Email": "helen@wbrc.co.uk"
        },
        {
            "ID": "00Q4G000019Ke0mUAC",
            "Email": "admin@hhbchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke0nUAC",
            "Email": "office@didcotbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke0oUAC",
            "Email": "allan.stewart@guiseleybaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke0pUAC",
            "Email": "office@sbc.co.uk"
        },
        {
            "ID": "00Q4G000019Ke0qUAC",
            "Email": "emmanuel_church_da18@yahoo.co.uk"
        },
        {
            "ID": "00Q4G000019Ke0rUAC",
            "Email": "admin@bethelpontyclun.org "
        },
        {
            "ID": "00Q4G000019Ke0sUAC",
            "Email": "finance@pantygwdydr.org.uk"
        },
        {
            "ID": "00Q4G000019Ke0tUAC",
            "Email": "gillardmc@aol.com"
        },
        {
            "ID": "00Q4G000019Ke0uUAC",
            "Email": "Leisa@balhambaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke0vUAC",
            "Email": "treasurer@skiptonbaptist.org"
        },
        {
            "ID": "00Q4G000019Ke0wUAC",
            "Email": "Bunyanmeeting@ggmail.com"
        },
        {
            "ID": "00Q4G000019Ke0xUAC",
            "Email": "info@boveybaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke0yUAC",
            "Email": "office@bbchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke0zUAC",
            "Email": "admin@bridgenorthbaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke10UAC",
            "Email": "liz.ord@ccwinch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke11UAC",
            "Email": "fiinace@hbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke12UAC",
            "Email": "Barry@faithinmorden.co.uk"
        },
        {
            "ID": "00Q4G000019Ke13UAC",
            "Email": "julie.passmore@theshorecommunity.church"
        },
        {
            "ID": "00Q4G000019Ke14UAC",
            "Email": "office@wadestreetchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke15UAC",
            "Email": "office@sloughbaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke16UAC",
            "Email": "ruth.hughes185@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke17UAC",
            "Email": "finance@histonbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke18UAC",
            "Email": "Matt@prestonbaptistchurch.com"
        },
        {
            "ID": "00Q4G000019Ke19UAC",
            "Email": "office@downtonbaptist.org"
        },
        {
            "ID": "00Q4G000019Ke1AUAS",
            "Email": "grahams@nailseabaptist.com"
        },
        {
            "ID": "00Q4G000019Ke1BUAS",
            "Email": "tom@thewellrbc.org"
        },
        {
            "ID": "00Q4G000019Ke1CUAS",
            "Email": "administrator@newlifechurch.org.ok"
        },
        {
            "ID": "00Q4G000019Ke1DUAS",
            "Email": "office@bewdleybaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1EUAS",
            "Email": "davecharles@dronfieldbaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke1FUAS",
            "Email": "administrator@castlehold.com"
        },
        {
            "ID": "00Q4G000019Ke1GUAS",
            "Email": "admin@witardroadbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1HUAS",
            "Email": "broading3@aol.com"
        },
        {
            "ID": "00Q4G000019Ke1IUAS",
            "Email": "steve.street@earlshall.com"
        },
        {
            "ID": "00Q4G000019Ke1JUAS",
            "Email": "admin@oltonbaptist.org"
        },
        {
            "ID": "00Q4G000019Ke1KUAS",
            "Email": "office@westburybaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1LUAS",
            "Email": "office@catshillbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1MUAS",
            "Email": "office@stonechurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke1NUAS",
            "Email": "admin@maghullbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke1OUAS",
            "Email": "minister@parkroadbaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke1PUAS",
            "Email": "office@enonbaptist.church"
        },
        {
            "ID": "00Q4G000019Ke1QUAS",
            "Email": "treasurer@penrallt.org"
        },
        {
            "ID": "00Q4G000019Ke1RUAS",
            "Email": "sam@mmbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1SUAS",
            "Email": "office@thornhillbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1TUAS",
            "Email": "treasurer@lighthousecharitytrust.co.uk"
        },
        {
            "ID": "00Q4G000019Ke1UUAS",
            "Email": "saunders64@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke1VUAS",
            "Email": "churchofficebhbc@gmial.com"
        },
        {
            "ID": "00Q4G000019Ke1WUAS",
            "Email": "jim.hammett@btopenworld.com"
        },
        {
            "ID": "00Q4G000019Ke1XUAS",
            "Email": "officestaff@ebc-bracknell.org"
        },
        {
            "ID": "00Q4G000019Ke1YUAS",
            "Email": "wdgbctreasurer@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke1ZUAS",
            "Email": "office@lisvanebaptist.com"
        },
        {
            "ID": "00Q4G000019Ke1aUAC",
            "Email": "office@brentwoodbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1bUAC",
            "Email": "office@welcomechurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1cUAC",
            "Email": "info@westgatebaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1dUAC",
            "Email": "julianmmwest@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke1eUAC",
            "Email": "Mark@jcchruch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1fUAC",
            "Email": "treasurer@trurobaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke1gUAC",
            "Email": "treasurer@northfieldbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1hUAC",
            "Email": "admin@brixington.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1iUAC",
            "Email": "HBC1OFFICE@AOL.COM"
        },
        {
            "ID": "00Q4G000019Ke1jUAC",
            "Email": "trudyab54@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke1kUAC",
            "Email": "pastorsimondowning@outlook.com"
        },
        {
            "ID": "00Q4G000019Ke1lUAC",
            "Email": "welcome@oasiswaterloo.org"
        },
        {
            "ID": "00Q4G000019Ke1mUAC",
            "Email": "denise371@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke1nUAC",
            "Email": "account@totnesunitedfree.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1oUAC",
            "Email": "Paul.bbch@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke1pUAC",
            "Email": "admin@ncbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1qUAC",
            "Email": "admin@perrybeechesbaptistchurch.com"
        },
        {
            "ID": "00Q4G000019Ke1rUAC",
            "Email": "pastor@stbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1sUAC",
            "Email": "office@hhbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1tUAC",
            "Email": "office@lhbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1uUAC",
            "Email": "office@limburybaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1vUAC",
            "Email": "office@mcbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1wUAC",
            "Email": "admin@hottchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke1xUAC",
            "Email": "info@wpbc.co"
        },
        {
            "ID": "00Q4G000019Ke1yUAC",
            "Email": "jeremythacker@uwclub.net"
        },
        {
            "ID": "00Q4G000019Ke1zUAC",
            "Email": "office@yorkbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke20UAC",
            "Email": "office@beckenhambaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke21UAC",
            "Email": "terr.law@newlifebaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeIQUA0",
            "Email": "admin@kirbyfree.org"
        },
        {
            "ID": "00Q4G000019Ke22UAC",
            "Email": "secretary@abingdonbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke23UAC",
            "Email": "teddybear3369@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke24UAC",
            "Email": "office@broadwaybaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke25UAC",
            "Email": "church@darlingtonbaptist.org"
        },
        {
            "ID": "00Q4G000019Ke26UAC",
            "Email": "office@ChesterRoadBC.org.uk"
        },
        {
            "ID": "00Q4G000019Ke27UAC",
            "Email": "pastor@beaconbaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke28UAC",
            "Email": "secretary@sidcupbaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke29UAC",
            "Email": "admin.phbc@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke2AUAS",
            "Email": "robfoster@suttonelms.co.uk"
        },
        {
            "ID": "00Q4G000019Ke2BUAS",
            "Email": "admin@wallingfordbaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke2CUAS",
            "Email": "hopebaptist@hotmail.co.uk"
        },
        {
            "ID": "00Q4G000019Ke2DUAS",
            "Email": "admin@thewellcc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke2EUAS",
            "Email": "orbc.org@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke2FUAS",
            "Email": "pastorcbc@live.com"
        },
        {
            "ID": "00Q4G000019Ke2GUAS",
            "Email": "admin@usbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke2HUAS",
            "Email": "westgreenbaptist@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke2IUAS",
            "Email": "secretary@desboroughbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke2JUAS",
            "Email": "admin@epsomchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke2KUAS",
            "Email": "johnhancock@live.co.uk"
        },
        {
            "ID": "00Q4G000019KeGKUA0",
            "Email": "office@lancasterbaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke2LUAS",
            "Email": "web@thatchambaptist.org.uk"
        },
        {
            "ID": "00Q4G000019KeGPUA0",
            "Email": "ian@w-b-c.org.uk"
        },
        {
            "ID": "00Q4G000019Ke2MUAS",
            "Email": "hello@basingstokebaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke2NUAS",
            "Email": "\t&#10;admin@hinckleybaptist.com"
        },
        {
            "ID": "00Q4G000019Ke2OUAS",
            "Email": "pastor@oundlebaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke2PUAS",
            "Email": "churchofficesbc@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke2QUAS",
            "Email": "treasurer@crohambaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke2RUAS",
            "Email": "info@southwickchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke2SUAS",
            "Email": "queenstreetbaptistchurchoffice@gmail.com "
        },
        {
            "ID": "00Q4G000019Ke2TUAS",
            "Email": "christine.mueller@framptonpark.org.uk"
        },
        {
            "ID": "00Q4G000019Ke2UUAS",
            "Email": "enquiries@woodsidechurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke2VUAS",
            "Email": "info@alnwickbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke2WUAS",
            "Email": "markinblackwood@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke2XUAS",
            "Email": "gatewayccentre@castletonbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke2YUAS",
            "Email": "help@andersonbaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke2ZUAS",
            "Email": "comms@tvbf.co.uk"
        },
        {
            "ID": "00Q4G000019Ke2aUAC",
            "Email": "office@hopebeaconsfield.co.uk"
        },
        {
            "ID": "00Q4G000019Ke2bUAC",
            "Email": "church@belvederebaptist.org"
        },
        {
            "ID": "00Q4G000019Ke2cUAC",
            "Email": "office@cairnsroad.org"
        },
        {
            "ID": "00Q4G000019Ke2dUAC",
            "Email": "churchadmin@customhousebaptist.org.uk "
        },
        {
            "ID": "00Q4G000019Ke2eUAC",
            "Email": "richard@hawkwellbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke2fUAC",
            "Email": "conservation@warmemorials.org"
        },
        {
            "ID": "00Q4G000019Ke2gUAC",
            "Email": "admin@woodfordbaptist.org"
        },
        {
            "ID": "00Q4G000019Ke2hUAC",
            "Email": "reception@ywbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke2iUAC",
            "Email": "minister@wrbchitchin.org.uk"
        },
        {
            "ID": "00Q4G000019Ke2jUAC",
            "Email": "secretary@orchardbaptistchurch.org"
        },
        {
            "ID": "00Q4G000019Ke2kUAC",
            "Email": "office@allnationsbc.plus.com"
        },
        {
            "ID": "00Q4G000019Ke2lUAC",
            "Email": "info@nnrbc.org"
        },
        {
            "ID": "00Q4G000019Ke2mUAC",
            "Email": "harehillslanebc@outlook.com"
        },
        {
            "ID": "00Q4G000019Ke2nUAC",
            "Email": "pastor@hucb.org.uk "
        },
        {
            "ID": "00Q4G000019Ke2oUAC",
            "Email": "geriknight@kcchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke2pUAC",
            "Email": "jennifer@pemburybaptistchurch.org"
        },
        {
            "ID": "00Q4G000019Ke2qUAC",
            "Email": "office@vinebaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke2rUAC",
            "Email": "wbc.centremanager@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke2sUAC",
            "Email": "actonbaptistchurchuk@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke2tUAC",
            "Email": "cindy.ecbaptist@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke2uUAC",
            "Email": "adminECBC@unitedbaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke2vUAC",
            "Email": "mailbox@baptist-heartofengland.org"
        },
        {
            "ID": "00Q4G000019Ke2wUAC",
            "Email": "philturley@aol.com"
        },
        {
            "ID": "00Q4G000019Ke2xUAC",
            "Email": "\t&#10;david.b.stott@googlemail.com"
        },
        {
            "ID": "00Q4G000019Ke2yUAC",
            "Email": "admin@trbc.info "
        },
        {
            "ID": "00Q4G000019Ke2zUAC",
            "Email": " info@kfclife.co.uk"
        },
        {
            "ID": "00Q4G000019Ke30UAC",
            "Email": "admin@abbeycentre.org.uk"
        },
        {
            "ID": "00Q4G000019Ke31UAC",
            "Email": "office@tamworthbaptists.org.uk"
        },
        {
            "ID": "00Q4G000019Ke32UAC",
            "Email": "billnbevsmith@talktalk.net"
        },
        {
            "ID": "00Q4G000019Ke33UAC",
            "Email": "office.nlbc@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke34UAC",
            "Email": "contact_us@woodberrydownchapel.org"
        },
        {
            "ID": "00Q4G000019Ke35UAC",
            "Email": "bedworthbaptist@yahoo.co.uk"
        },
        {
            "ID": "00Q4G000019Ke36UAC",
            "Email": "office@bcy.org.uk"
        },
        {
            "ID": "00Q4G000019Ke37UAC",
            "Email": "southfields@everyday.org.uk"
        },
        {
            "ID": "00Q4G000019Ke38UAC",
            "Email": "office@wollastonchurch.plus.com"
        },
        {
            "ID": "00Q4G000019Ke39UAC",
            "Email": "office@myclc.org.uk"
        },
        {
            "ID": "00Q4G000019KeGZUA0",
            "Email": "cheryl.payne@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke3AUAS",
            "Email": "chrishawleyhbc@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke3BUAS",
            "Email": "sbc-finance@outlook.com"
        },
        {
            "ID": "00Q4G000019Ke3CUAS",
            "Email": "daveb@trinitybaptist.co.uk "
        },
        {
            "ID": "00Q4G000019Ke3DUAS",
            "Email": "andrea@cpcc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3EUAS",
            "Email": "info@oakesbaptist.org.uk   "
        },
        {
            "ID": "00Q4G000019Ke3FUAS",
            "Email": "admin@tyndalereading.org.uk"
        },
        {
            "ID": "00Q4G000019KeIVUA0",
            "Email": "info@yardleybaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke3GUAS",
            "Email": "info@wbchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke3HUAS",
            "Email": "secretary@pershorebaptist.org.uk   "
        },
        {
            "ID": "00Q4G000019Ke3IUAS",
            "Email": "mebchurch@millendbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3JUAS",
            "Email": "finance@bournebaptistchurch.org"
        },
        {
            "ID": "00Q4G000019Ke3KUAS",
            "Email": "churchoffice@gatewaybaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3LUAS",
            "Email": "info@clarebaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3MUAS",
            "Email": "church.office@gsgbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3NUAS",
            "Email": "christiancentre.rhyl@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke3OUAS",
            "Email": "info@peacechapeltelford.org"
        },
        {
            "ID": "00Q4G000019Ke3PUAS",
            "Email": "ulrike.kibble@cornerstonethame.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3QUAS",
            "Email": "Peter@tbbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3RUAS",
            "Email": "office@hillypark.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3SUAS",
            "Email": "treasurer@christchurchbaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke3TUAS",
            "Email": "admin@tringbaptistchurch.co.uk﻿"
        },
        {
            "ID": "00Q4G000019Ke3UUAS",
            "Email": "pastor@brixhambaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3VUAS",
            "Email": "treasurer@christchurchunitedcardiff.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3WUAS",
            "Email": " info@kcbc.org.uk"
        },
        {
            "ID": "00Q4G000019KeGeUAK",
            "Email": "stuart@melbourn-baptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3XUAS",
            "Email": "bvbcoffice484@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke3YUAS",
            "Email": "minister@stalhambaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3ZUAS",
            "Email": " office@TeddingtonBaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3aUAC",
            "Email": "churchsecretary.bbc@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke3bUAC",
            "Email": "minister@rr-bc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3cUAC",
            "Email": "pastor@brunswick-baptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke3dUAC",
            "Email": "info@westhucknall.co.uk"
        },
        {
            "ID": "00Q4G000019Ke3eUAC",
            "Email": "office@unionchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3fUAC",
            "Email": "info@kentonbaptist.com"
        },
        {
            "ID": "00Q4G000019Ke3gUAC",
            "Email": "ks@swbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3hUAC",
            "Email": "jeremyb@dtwo.co.uk"
        },
        {
            "ID": "00Q4G000019Ke3iUAC",
            "Email": "adminpprbc@sky.com"
        },
        {
            "ID": "00Q4G000019Ke3jUAC",
            "Email": "admin@stcsheffield.org"
        },
        {
            "ID": "00Q4G000019Ke3kUAC",
            "Email": "office@bartonbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke3lUAC",
            "Email": "admin@amershamfreechurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3mUAC",
            "Email": "secretary@spurgeonbaptist.com"
        },
        {
            "ID": "00Q4G000019Ke3nUAC",
            "Email": "wayne@wayneclarke.org"
        },
        {
            "ID": "00Q4G000019Ke3oUAC",
            "Email": "mordenpark@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke3pUAC",
            "Email": "office@templebaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3qUAC",
            "Email": "stubbaptist@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke3rUAC",
            "Email": "office@westbridgfordbaptist.church"
        },
        {
            "ID": "00Q4G000019Ke3sUAC",
            "Email": "church@crossways.info"
        },
        {
            "ID": "00Q4G000019Ke3tUAC",
            "Email": "gavincarpenterminister@earlsfieldbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3uUAC",
            "Email": "treasurer@godstonebc.org"
        },
        {
            "ID": "00Q4G000019Ke3vUAC",
            "Email": "minister@staffordbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke3wUAC",
            "Email": "Treasurer@hpbc.co.uk"
        },
        {
            "ID": "00Q4G000019Ke3xUAC",
            "Email": "lynneandowen@tiscali.co.uk"
        },
        {
            "ID": "00Q4G000019Ke3yUAC",
            "Email": "office@wiltonbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke3zUAC",
            "Email": "info@tabcentre.com"
        },
        {
            "ID": "00Q4G000019Ke40UAC",
            "Email": "rodbournebaptists@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke41UAC",
            "Email": "church.enquiries@dawleybaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke42UAC",
            "Email": "info@greenleafroadbaptistchurch.com"
        },
        {
            "ID": "00Q4G000019Ke43UAC",
            "Email": "admin@batterseachapel.org.uk"
        },
        {
            "ID": "00Q4G000019Ke44UAC",
            "Email": "info@newhopebaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke45UAC",
            "Email": "info@bethelbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke46UAC",
            "Email": "info@bridgwaterbaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke47UAC",
            "Email": "admin@burnhambaptists.org"
        },
        {
            "ID": "00Q4G000019Ke48UAC",
            "Email": "info@burwellbaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke49UAC",
            "Email": "scottishbigmac@hotmail.com"
        },
        {
            "ID": "00Q4G000019Ke4AUAS",
            "Email": "ebc-netherton@hotmail.co.uk"
        },
        {
            "ID": "00Q4G000019Ke4BUAS",
            "Email": "treasurer@oakridgebaptist.org.uk  "
        },
        {
            "ID": "00Q4G000019Ke4CUAS",
            "Email": "lewes.eastgate@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke4DUAS",
            "Email": "office@haddonhall.net"
        },
        {
            "ID": "00Q4G000019Ke4EUAS",
            "Email": "office@mhechurch.com"
        },
        {
            "ID": "00Q4G000019Ke4FUAS",
            "Email": "secretary@mhbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke4GUAS",
            "Email": "srbc_enquiries@btconnect.com"
        },
        {
            "ID": "00Q4G000019Ke4HUAS",
            "Email": "revjamesw@blueyonder.co.uk"
        },
        {
            "ID": "00Q4G000019Ke4IUAS",
            "Email": "hanleybaptistchurch@googlemail.com"
        },
        {
            "ID": "00Q4G000019Ke4JUAS",
            "Email": "c.riley823@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke4KUAS",
            "Email": "admin@tottenhambaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke4LUAS",
            "Email": "admin@tywynbaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke4MUAS",
            "Email": "info.alcesterbaptist@gmail.com"
        },
        {
            "ID": "00Q4G000019KeGoUAK",
            "Email": "secretary@bgb.org.uk"
        },
        {
            "ID": "00Q4G000019Ke4NUAS",
            "Email": "douglas.geaterchilds@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke4OUAS",
            "Email": "info@kubc.co.uk"
        },
        {
            "ID": "00Q4G000019Ke4PUAS",
            "Email": "office@caverhambaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke4QUAS",
            "Email": "admin@beaconchurchuk.com"
        },
        {
            "ID": "00Q4G000019Ke4RUAS",
            "Email": "info@mountzion.co.uk"
        },
        {
            "ID": "00Q4G000019Ke4SUAS",
            "Email": "ebenezer-aberavon@live.com"
        },
        {
            "ID": "00Q4G000019Ke4TUAS",
            "Email": "mbave@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke4UUAS",
            "Email": "alistair@sandbach-baptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke4VUAS",
            "Email": "admin@holmergreenbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke4WUAS",
            "Email": "boro-baptist@live.co.uk"
        },
        {
            "ID": "00Q4G000019Ke4XUAS",
            "Email": "prbaptist@btconnect.com"
        },
        {
            "ID": "00Q4G000019Ke4YUAS",
            "Email": "somptingcommunitychurch.office@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke4ZUAS",
            "Email": "vijisathi@hotmail.co.uk"
        },
        {
            "ID": "00Q4G000019Ke4aUAC",
            "Email": "pastorian@wimbourne-baptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke4bUAC",
            "Email": "frobert_harding@hotmail.com"
        },
        {
            "ID": "00Q4G000019Ke4cUAC",
            "Email": "office@careybaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke4dUAC",
            "Email": "doritamdavies@yahoo.co.uk"
        },
        {
            "ID": "00Q4G000019Ke4eUAC",
            "Email": "admin@claphambaptist.com"
        },
        {
            "ID": "00Q4G000019Ke4fUAC",
            "Email": "pjm436@hotmail.co.uk"
        },
        {
            "ID": "00Q4G000019Ke4gUAC",
            "Email": "ichthus1000@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke4hUAC",
            "Email": "amywearing@uptonbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke4iUAC",
            "Email": "enquiries@chingfordmountbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke4jUAC",
            "Email": "info@newaddingtonbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke4kUAC",
            "Email": "info@grangebaptist.org"
        },
        {
            "ID": "00Q4G000019Ke4lUAC",
            "Email": "office@stannesbaptist.org"
        },
        {
            "ID": "00Q4G000019Ke4mUAC",
            "Email": "rev@basfordbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke4nUAC",
            "Email": "info@southhoxheybaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke4oUAC",
            "Email": "holmes@isherlock.plus.com"
        },
        {
            "ID": "00Q4G000019Ke4pUAC",
            "Email": "info@longfleetbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke4qUAC",
            "Email": "Treasurer@suttonbaptist.org"
        },
        {
            "ID": "00Q4G000019Ke4rUAC",
            "Email": "secretary@brattonbaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke4sUAC",
            "Email": "blackheathbaptist@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke4tUAC",
            "Email": "secrtary@greatashbycc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke4uUAC",
            "Email": "info@roselandscommunitychurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke4vUAC",
            "Email": "treasurer@bryn-im.org"
        },
        {
            "ID": "00Q4G000019Ke4wUAC",
            "Email": "cucsecretary@hotmail.co.uk"
        },
        {
            "ID": "00Q4G000019Ke4xUAC",
            "Email": "enquiries@littleoverbaptists.org"
        },
        {
            "ID": "00Q4G000019Ke4yUAC",
            "Email": "secretary@blbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke4zUAC",
            "Email": "wkchurch2@hotmail.com"
        },
        {
            "ID": "00Q4G000019Ke50UAC",
            "Email": "pevenseybaybaptist@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke51UAC",
            "Email": "info@mcflondon.org"
        },
        {
            "ID": "00Q4G000019Ke52UAC",
            "Email": "secretary@underhillbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke53UAC",
            "Email": "office@bradninchbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke54UAC",
            "Email": "admin@fernhillheathbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke55UAC",
            "Email": "info@wellingtonsquare.co.uk"
        },
        {
            "ID": "00Q4G000019Ke56UAC",
            "Email": "revcollict@outlook.com"
        },
        {
            "ID": "00Q4G000019Ke57UAC",
            "Email": "hello@portsladebaptist.org.uk "
        },
        {
            "ID": "00Q4G000019Ke58UAC",
            "Email": "office@broadmeadbaptist.org.uk "
        },
        {
            "ID": "00Q4G000019Ke59UAC",
            "Email": "info@springfieldparkbaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke5AUAS",
            "Email": "office@orchardbaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke5BUAS",
            "Email": "unionchapelbaptist@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke5CUAS",
            "Email": "admin@haylingislandbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke5DUAS",
            "Email": "leigh@stoneygatebaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke5EUAS",
            "Email": "admin@boynhillbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke5FUAS",
            "Email": "info@southbankbaptist.org"
        },
        {
            "ID": "00Q4G000019Ke5GUAS",
            "Email": "rob@southcravenbaptistchurch.com "
        },
        {
            "ID": "00Q4G000019Ke5HUAS",
            "Email": "Office@WSwinLyd.org.uk"
        },
        {
            "ID": "00Q4G000019Ke5IUAS",
            "Email": "cranhambaptistchurch@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke5JUAS",
            "Email": "support@latchfordbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke5KUAS",
            "Email": "Secretary@laindonbaptistchurch.org "
        },
        {
            "ID": "00Q4G000019Ke5LUAS",
            "Email": "desfordfreechurch@live.com"
        },
        {
            "ID": "00Q4G000019KeGtUAK",
            "Email": "dbcminister@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke5MUAS",
            "Email": "admin@markyatebaptist.org"
        },
        {
            "ID": "00Q4G000019Ke5NUAS",
            "Email": "admin@pbbaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke5OUAS",
            "Email": "admin@fairfieldcommunityhall.co.uk"
        },
        {
            "ID": "00Q4G000019Ke5PUAS",
            "Email": "info@addlestonebaptist.org.uk "
        },
        {
            "ID": "00Q4G000019Ke5QUAS",
            "Email": "peterpastor1946@hotmail.co.uk "
        },
        {
            "ID": "00Q4G000019Ke5RUAS",
            "Email": "steveoncomputer@aol.com"
        },
        {
            "ID": "00Q4G000019Ke5SUAS",
            "Email": "officebroughtonparish@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke5TUAS",
            "Email": "easternavenuebaptistchurch@hotmail.com"
        },
        {
            "ID": "00Q4G000019KeH8UAK",
            "Email": "johnbunyanbaptist@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke5UUAS",
            "Email": "smitcheson@btconnect.com"
        },
        {
            "ID": "00Q4G000019Ke5VUAS",
            "Email": "zionbaptisttenterden@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke5WUAS",
            "Email": "info@highamway.co.uk"
        },
        {
            "ID": "00Q4G000019Ke5XUAS",
            "Email": "circuitoffice@burnleyandpendlemethodists.org.uk "
        },
        {
            "ID": "00Q4G000019Ke5YUAS",
            "Email": "fromebapch@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke5ZUAS",
            "Email": "office@bramleybaptist.org.uk"
        },
        {
            "ID": "00Q4G000019KeHDUA0",
            "Email": "mkcommunityministry@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke5aUAC",
            "Email": "uabco@hotmail.co.uk"
        },
        {
            "ID": "00Q4G000019Ke5bUAC",
            "Email": "sbcnc@outlook.com"
        },
        {
            "ID": "00Q4G000019Ke5cUAC",
            "Email": "admin@shinfieldbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke5dUAC",
            "Email": "office@southwickbaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke5eUAC",
            "Email": "churchadmin@sheepstreet.org.uk"
        },
        {
            "ID": "00Q4G000019Ke5fUAC",
            "Email": "fbc@fleckneybaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke5gUAC",
            "Email": "hookybaptist@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke5hUAC",
            "Email": "fionaannhicks@gmail.com"
        },
        {
            "ID": "00Q4G000019KeHIUA0",
            "Email": "ad.mcfall@btopenworld.com"
        },
        {
            "ID": "00Q4G000019Ke5iUAC",
            "Email": "Secretary@wallsendbaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke5jUAC",
            "Email": "parish.office@walthamabbeychurch.co.uk"
        },
        {
            "ID": "00Q4G000019KeHNUA0",
            "Email": "woodstockbaptistchurch@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke5kUAC",
            "Email": "info@arnesbybc.co.uk"
        },
        {
            "ID": "00Q4G000019Ke5lUAC",
            "Email": "pastor@costesseybaptist.org.uk "
        },
        {
            "ID": "00Q4G000019Ke5mUAC",
            "Email": "Secretary@longfordbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke5nUAC",
            "Email": "revjoy@ewyasharoldbaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke5oUAC",
            "Email": "help@oldfieldfreechurchbaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke5pUAC",
            "Email": "longeatonbatistchurch@yahoo.com"
        },
        {
            "ID": "00Q4G000019Ke5qUAC",
            "Email": "info@malboroughbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke5rUAC",
            "Email": "office@emmanuelgroup.org.uk"
        },
        {
            "ID": "00Q4G000019Ke5sUAC",
            "Email": "mail@AbbeyBaptistChurch.org.uk "
        },
        {
            "ID": "00Q4G000019Ke5tUAC",
            "Email": "info@aenonbaptist.org"
        },
        {
            "ID": "00Q4G000019Ke5uUAC",
            "Email": "info@yba.org.uk "
        },
        {
            "ID": "00Q4G000019Ke5vUAC",
            "Email": "cypchapel@gmail.com"
        },
        {
            "ID": "00Q4G000019KeHcUAK",
            "Email": "elder@borstalbaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke5wUAC",
            "Email": "info@churchfromscratch.org"
        },
        {
            "ID": "00Q4G000019KeHhUAK",
            "Email": "derekcarterwbc@aol.com"
        },
        {
            "ID": "00Q4G000019Ke5xUAC",
            "Email": "bildestonbc@gmail.com "
        },
        {
            "ID": "00Q4G000019Ke5yUAC",
            "Email": "Hutton1850@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke5zUAC",
            "Email": "secretary@leytonstoneunitedfree.co.uk"
        },
        {
            "ID": "00Q4G000019Ke60UAC",
            "Email": "info@chudleighbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke61UAC",
            "Email": "info@devonportbaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke62UAC",
            "Email": "info@hooebaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke63UAC",
            "Email": "ImmanuelSouthsea@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke64UAC",
            "Email": "life@spurgeonchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeHmUAK",
            "Email": "hbc_treasurer@icloud.com"
        },
        {
            "ID": "00Q4G000019Ke65UAC",
            "Email": "crondallbaptist@yahoo.com"
        },
        {
            "ID": "00Q4G000019Ke66UAC",
            "Email": "pastor@haddenhambaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke67UAC",
            "Email": "uhbchurch@outlook.com"
        },
        {
            "ID": "00Q4G000019Ke68UAC",
            "Email": "pastor@centenarybc.co.uk"
        },
        {
            "ID": "00Q4G000019Ke69UAC",
            "Email": "zbcmirfield@gmx.co.uk"
        },
        {
            "ID": "00Q4G000019Ke6AUAS",
            "Email": "cbc1831@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke6BUAS",
            "Email": "pmlbaptists@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke6CUAS",
            "Email": "office@loughtonbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke6DUAS",
            "Email": "tellmemore@opendoorchurch-uk.com"
        },
        {
            "ID": "00Q4G000019Ke6EUAS",
            "Email": "office@swaffhambaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke6FUAS",
            "Email": "treasurer@sjrbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke6GUAS",
            "Email": "lomas904@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke6HUAS",
            "Email": "ayleshambaptist@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke6IUAS",
            "Email": "administrator@whaddonway.church"
        },
        {
            "ID": "00Q4G000019Ke6JUAS",
            "Email": "waterloounitedfreechurch@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke6KUAS",
            "Email": "bethany@bethanybaptistchurch.wales"
        },
        {
            "ID": "00Q4G000019Ke6LUAS",
            "Email": "barhug1az@btinternet.com"
        },
        {
            "ID": "00Q4G000019KeHrUAK",
            "Email": "margaretsoutham1@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke6MUAS",
            "Email": "admin@newlifebaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke6NUAS",
            "Email": "office@addiscombebaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke6OUAS",
            "Email": "pastor@girtonbaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke6PUAS",
            "Email": "brad.lincoln@me.com"
        },
        {
            "ID": "00Q4G000019Ke6QUAS",
            "Email": "longhopebaptistchurch@yahoo.co.uk"
        },
        {
            "ID": "00Q4G000019Ke6RUAS",
            "Email": "contactus@northbusheybaptist.com"
        },
        {
            "ID": "00Q4G000019KeHwUAK",
            "Email": "info@highfield-community.org.uk"
        },
        {
            "ID": "00Q4G000019Ke6SUAS",
            "Email": "bruce.porter@sky.com"
        },
        {
            "ID": "00Q4G000019Ke6TUAS",
            "Email": "bargees@hotmail.com"
        },
        {
            "ID": "00Q4G000019Ke6UUAS",
            "Email": "lentonslane@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke6VUAS",
            "Email": "churchsecretaryesbc@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke6WUAS",
            "Email": "info@framlinghambaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke6XUAS",
            "Email": "westburyavenuebaptistchurch@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke6YUAS",
            "Email": "richard@kingschurchaddlestone.org.uk"
        },
        {
            "ID": "00Q4G000019Ke6ZUAS",
            "Email": "plblenk@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke6aUAC",
            "Email": "karen@baptist-heartofengland.org"
        },
        {
            "ID": "00Q4G000019Ke6bUAC",
            "Email": "admin@Oasiscommunitychurch.net"
        },
        {
            "ID": "00Q4G000019Ke6cUAC",
            "Email": "bill.johnston@hampden.co.uk"
        },
        {
            "ID": "00Q4G000019Ke6dUAC",
            "Email": "office.kcc@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke6eUAC",
            "Email": "jane@nwba.org.uk"
        },
        {
            "ID": "00Q4G000019Ke6fUAC",
            "Email": "treasurer@sandybaptistchurch.org"
        },
        {
            "ID": "00Q4G000019KeIaUAK",
            "Email": "webadmin@studleybaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke6gUAC",
            "Email": "syirrell@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke6hUAC",
            "Email": "finance@yiewlseybaptistchurch.com"
        },
        {
            "ID": "00Q4G000019Ke6iUAC",
            "Email": "doug.gunn@icloud.com"
        },
        {
            "ID": "00Q4G000019Ke6jUAC",
            "Email": "olivestanford@hotmail.com"
        },
        {
            "ID": "00Q4G000019Ke6kUAC",
            "Email": "pastor@bostonbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke6lUAC",
            "Email": "secretary@gasgreen.org.uk "
        },
        {
            "ID": "00Q4G000019Ke6mUAC",
            "Email": "gordon.trinder@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke6nUAC",
            "Email": "kfcbsecretary@btconnect.com"
        },
        {
            "ID": "00Q4G000019Ke6oUAC",
            "Email": "normarg.smith@tiscali.co.uk"
        },
        {
            "ID": "00Q4G000019Ke6pUAC",
            "Email": "marketbosworthfreechurch@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke6qUAC",
            "Email": "pauldriscoll46@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke6rUAC",
            "Email": "northallchapel@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke6sUAC",
            "Email": "info@sandownbaptist.church"
        },
        {
            "ID": "00Q4G000019Ke6tUAC",
            "Email": "minister@llcc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke6uUAC",
            "Email": "ashfordcommonbaptist@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke6vUAC",
            "Email": " info@widnesbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke6wUAC",
            "Email": "kensingtonbreconlettings@gmail.com "
        },
        {
            "ID": "00Q4G000019Ke6xUAC",
            "Email": "info@hilllanebaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke6yUAC",
            "Email": "earlestownbaptistchurch@gmail.com "
        },
        {
            "ID": "00Q4G000019Ke6zUAC",
            "Email": "church@rcftwydall.org.uk"
        },
        {
            "ID": "00Q4G000019Ke70UAC",
            "Email": "brenda@bmobrien.plus.com"
        },
        {
            "ID": "00Q4G000019Ke71UAC",
            "Email": "williammoss748@btinternet.com "
        },
        {
            "ID": "00Q4G000019Ke72UAC",
            "Email": "secretaries@unitedchurchhyde.org.uk "
        },
        {
            "ID": "00Q4G000019Ke73UAC",
            "Email": "Kevfreeman@virginmedia.com "
        },
        {
            "ID": "00Q4G000019Ke74UAC",
            "Email": "uppertrosnantbc@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke75UAC",
            "Email": "chrisknott@starfishmalawi.com "
        },
        {
            "ID": "00Q4G000019Ke76UAC",
            "Email": "bethany@illtyd.co.uk"
        },
        {
            "ID": "00Q4G000019Ke77UAC",
            "Email": "info@altrinchambaptist.org&#10;"
        },
        {
            "ID": "00Q4G000019Ke78UAC",
            "Email": "blackmorebaptistchurch@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke79UAC",
            "Email": "john@citychurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke7AUAS",
            "Email": "pillbaptist@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke7BUAS",
            "Email": "office@zionbc.org.uk "
        },
        {
            "ID": "00Q4G000019Ke7CUAS",
            "Email": "cfbc.office@btconnect.com"
        },
        {
            "ID": "00Q4G000019Ke7DUAS",
            "Email": "combemartinbaptist@outlook.com"
        },
        {
            "ID": "00Q4G000019Ke7EUAS",
            "Email": "adam.momcilovic@dewsburybaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke7FUAS",
            "Email": "treasurer@abingdonbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke7GUAS",
            "Email": "pastor@fulhambaptistchurch.org"
        },
        {
            "ID": "00Q4G000019Ke7HUAS",
            "Email": "Secretary@headlandbaptistchurch.co.uk "
        },
        {
            "ID": "00Q4G000019Ke7IUAS",
            "Email": "community@hope-baptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke7JUAS",
            "Email": "info@ibstockbaptistchurch.com "
        },
        {
            "ID": "00Q4G000019Ke7KUAS",
            "Email": "stone.michaelz@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke7LUAS",
            "Email": "pat.midgley@live.co.uk"
        },
        {
            "ID": "00Q4G000019Ke7MUAS",
            "Email": "Secretary@newportbaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke7NUAS",
            "Email": "newwhitemoor@virginmedia.com "
        },
        {
            "ID": "00Q4G000019Ke7OUAS",
            "Email": "info@pwbc.org.uk "
        },
        {
            "ID": "00Q4G000019Ke7PUAS",
            "Email": "admin@catherinestreetbaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke7QUAS",
            "Email": "office@ollbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke7RUAS",
            "Email": "baptistchurch@ramsdenbellhouse.info"
        },
        {
            "ID": "00Q4G000019Ke7SUAS",
            "Email": "treasurer@rickmansworthbaptist.org.uk "
        },
        {
            "ID": "00Q4G000019Ke7TUAS",
            "Email": "penuel.roch@hotmail.com"
        },
        {
            "ID": "00Q4G000019Ke7UUAS",
            "Email": " contact@open-door.org "
        },
        {
            "ID": "00Q4G000019Ke7VUAS",
            "Email": "brightonrbc@gmail.com "
        },
        {
            "ID": "00Q4G000019Ke7WUAS",
            "Email": "contact@roomfieldchurch.org "
        },
        {
            "ID": "00Q4G000019Ke7XUAS",
            "Email": "info@westgatebaptist.org.uk "
        },
        {
            "ID": "00Q4G000019Ke7YUAS",
            "Email": "info@gbchurch.co.uk "
        },
        {
            "ID": "00Q4G000019Ke7ZUAS",
            "Email": "gmbc.secr@gmail.com "
        },
        {
            "ID": "00Q4G000019Ke7aUAC",
            "Email": "haslandbaptist@gmail.com "
        },
        {
            "ID": "00Q4G000019Ke7bUAC",
            "Email": " admin@quaystone.org"
        },
        {
            "ID": "00Q4G000019Ke7cUAC",
            "Email": "Pamela.popp1941@gmail.com "
        },
        {
            "ID": "00Q4G000019Ke7dUAC",
            "Email": "mjsherburn@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke7eUAC",
            "Email": "enquiry@mersthambaptistchurch.co.uk "
        },
        {
            "ID": "00Q4G000019Ke7fUAC",
            "Email": "office@watlingvalley.org.uk"
        },
        {
            "ID": "00Q4G000019Ke7gUAC",
            "Email": "heather.andrews721@gmail.com "
        },
        {
            "ID": "00Q4G000019Ke7hUAC",
            "Email": "cornerstone.oswestry@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke7iUAC",
            "Email": "pastornickpbc@gmail.com "
        },
        {
            "ID": "00Q4G000019Ke7jUAC",
            "Email": "office@cippenhambaptistchurch.com "
        },
        {
            "ID": "00Q4G000019Ke7kUAC",
            "Email": "stroudgreenbaptist@gmail.com "
        },
        {
            "ID": "00Q4G000019Ke7lUAC",
            "Email": "info@halconbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke7mUAC",
            "Email": "thaxtedbaptistchurch@gmail.com "
        },
        {
            "ID": "00Q4G000019Ke7nUAC",
            "Email": "tim@fulmerston.co.uk"
        },
        {
            "ID": "00Q4G000019Ke7oUAC",
            "Email": "secretary@wetherbybaptist.org.uk "
        },
        {
            "ID": "00Q4G000019Ke7pUAC",
            "Email": "caroline.I.johnston@gsk.com "
        },
        {
            "ID": "00Q4G000019Ke7qUAC",
            "Email": "zimkins@yahoo.co.uk "
        },
        {
            "ID": "00Q4G000019Ke7rUAC",
            "Email": "rosieaustin@live.co.uk "
        },
        {
            "ID": "00Q4G000019Ke7sUAC",
            "Email": " bcsundayclub@gmail.com  "
        },
        {
            "ID": "00Q4G000019Ke7tUAC",
            "Email": "office@millroadbaptistchurch.com "
        },
        {
            "ID": "00Q4G000019Ke7uUAC",
            "Email": "stephen.jackson27@btopenworld.com (Pastor's email)"
        },
        {
            "ID": "00Q4G000019Ke7vUAC",
            "Email": "office@cirencester-baptist.org "
        },
        {
            "ID": "00Q4G000019Ke7wUAC",
            "Email": " john@chewbaptist.org "
        },
        {
            "ID": "00Q4G000019Ke7xUAC",
            "Email": "office@bethelcardiff.org.uk"
        },
        {
            "ID": "00Q4G000019Ke7yUAC",
            "Email": "steve@longheathchurch.org  "
        },
        {
            "ID": "00Q4G000019Ke7zUAC",
            "Email": "contact@freedomgosport.com "
        },
        {
            "ID": "00Q4G000019Ke80UAC",
            "Email": "office@christchurch-ipswich.org.uk "
        },
        {
            "ID": "00Q4G000019Ke81UAC",
            "Email": "christchurchnsfb@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke82UAC",
            "Email": "secretary@presteignebaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke83UAC",
            "Email": "earlswoodbc@outlook.com"
        },
        {
            "ID": "00Q4G000019Ke84UAC",
            "Email": "revrosw@virginmedia.com"
        },
        {
            "ID": "00Q4G000019Ke85UAC",
            "Email": "WBC@hotmail.co.uk"
        },
        {
            "ID": "00Q4G000019Ke86UAC",
            "Email": "churchadmin@panshangerchurch.com"
        },
        {
            "ID": "00Q4G000019Ke87UAC",
            "Email": " admin@woodfordbaptist.org"
        },
        {
            "ID": "00Q4G000019Ke88UAC",
            "Email": "minister@peachcroftcc.org"
        },
        {
            "ID": "00Q4G000019Ke89UAC",
            "Email": "billesdonpastor@gmail.com "
        },
        {
            "ID": "00Q4G000019Ke8AUAS",
            "Email": "bates.777@btinternet.com "
        },
        {
            "ID": "00Q4G000019Ke8BUAS",
            "Email": "office@wintergardenschurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke8CUAS",
            "Email": "mike@cinderford-churches.org.uk"
        },
        {
            "ID": "00Q4G000019Ke8DUAS",
            "Email": "Info@BetelChapel.org "
        },
        {
            "ID": "00Q4G000019Ke8EUAS",
            "Email": "hathernbaptist@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke8FUAS",
            "Email": "admin@perrybaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke8GUAS",
            "Email": "office@plattchurch.org"
        },
        {
            "ID": "00Q4G000019Ke8HUAS",
            "Email": "a.reed@ntlworld.com"
        },
        {
            "ID": "00Q4G000019Ke8IUAS",
            "Email": "stjohnskp@hotmail.co.uk"
        },
        {
            "ID": "00Q4G000019Ke8JUAS",
            "Email": "vivaldihp95@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke8KUAS",
            "Email": "leaders@portonbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke8LUAS",
            "Email": "administrator@trinityrawdon.org.uk"
        },
        {
            "ID": "00Q4G000019Ke8MUAS",
            "Email": "stpaulsskegness@gmail.com "
        },
        {
            "ID": "00Q4G000019Ke8NUAS",
            "Email": "stroudgreenbaptist@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke8OUAS",
            "Email": " admin@crownroadbaptist.org"
        },
        {
            "ID": "00Q4G000019Ke8PUAS",
            "Email": "shotgatebaptist@yahoo.com"
        },
        {
            "ID": "00Q4G000019Ke8QUAS",
            "Email": "gracepeople.wrexham@hotmail.com"
        },
        {
            "ID": "00Q4G000019Ke8RUAS",
            "Email": "info@knbc.org"
        },
        {
            "ID": "00Q4G000019Ke8SUAS",
            "Email": "karen@churchofbures.co.uk"
        },
        {
            "ID": "00Q4G000019Ke8TUAS",
            "Email": "ad.havencc@outlook.com"
        },
        {
            "ID": "00Q4G000019Ke8UUAS",
            "Email": "admin@hobc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke8VUAS",
            "Email": "enquiries@ilfracombebaptistchurch.org.uk "
        },
        {
            "ID": "00Q4G000019Ke8WUAS",
            "Email": "office@lrbc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke8XUAS",
            "Email": "office@stmarysnewent.org"
        },
        {
            "ID": "00Q4G000019Ke8YUAS",
            "Email": "peterjsteward@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke8ZUAS",
            "Email": "treasurer.baddesley@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke8aUAC",
            "Email": "pilcen@aol.com"
        },
        {
            "ID": "00Q4G000019Ke8bUAC",
            "Email": "sjwmin@aol.com"
        },
        {
            "ID": "00Q4G000019Ke8cUAC",
            "Email": "roegreenchurch@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke8dUAC",
            "Email": "contact@ammanfordchurch.com"
        },
        {
            "ID": "00Q4G000019Ke8eUAC",
            "Email": "info@grenfellbaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke8fUAC",
            "Email": " kay@paintbrush29.plus.com"
        },
        {
            "ID": "00Q4G000019Ke8gUAC",
            "Email": "admin@cmbaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke8hUAC",
            "Email": "brendatoft@yahoo.co.uk"
        },
        {
            "ID": "00Q4G000019Ke8iUAC",
            "Email": "Davebchurch@outlook.com"
        },
        {
            "ID": "00Q4G000019Ke8jUAC",
            "Email": "wagih@laec.co.uk"
        },
        {
            "ID": "00Q4G000019Ke8kUAC",
            "Email": "admin@freemantlebaptistchurch.org"
        },
        {
            "ID": "00Q4G000019Ke8lUAC",
            "Email": "info@lynchchapel.org.uk"
        },
        {
            "ID": "00Q4G000019Ke8mUAC",
            "Email": "kevin@wellspringchurchwirksworth.co.uk"
        },
        {
            "ID": "00Q4G000019Ke8nUAC",
            "Email": "donchampken@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke8oUAC",
            "Email": "rev.arderne@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke8pUAC",
            "Email": "hello@unionccc.org.uk"
        },
        {
            "ID": "00Q4G000019Ke8qUAC",
            "Email": "admin@thbc.info "
        },
        {
            "ID": "00Q4G000019Ke8rUAC",
            "Email": "minister@boultonlane.org.uk"
        },
        {
            "ID": "00Q4G000019Ke8sUAC",
            "Email": "pastor@bridgewaterbaptist.org.uk "
        },
        {
            "ID": "00Q4G000019Ke8tUAC",
            "Email": "info@eynsfordbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke8uUAC",
            "Email": "pastor@hillparkbaptist.com"
        },
        {
            "ID": "00Q4G000019Ke8vUAC",
            "Email": "debbie.crump@outlook.com"
        },
        {
            "ID": "00Q4G000019Ke8wUAC",
            "Email": "upperedenbaptistchurch@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke8xUAC",
            "Email": "ChorltonCentralChurch@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke8yUAC",
            "Email": "bowthorpechurch@tiscali.co.uk"
        },
        {
            "ID": "00Q4G000019Ke8zUAC",
            "Email": " info@beauchiefbaptist.org.uk "
        },
        {
            "ID": "00Q4G000019Ke90UAC",
            "Email": "minister@ashdonbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke91UAC",
            "Email": " david.rhodes53@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke92UAC",
            "Email": "tvcsecretary@outlook.com"
        },
        {
            "ID": "00Q4G000019Ke93UAC",
            "Email": "fishersgatelighthouse@outlook.com​"
        },
        {
            "ID": "00Q4G000019Ke94UAC",
            "Email": "r_quance@hotmail.com "
        },
        {
            "ID": "00Q4G000019Ke95UAC",
            "Email": "clerk@fairoak-pc.gov.uk"
        },
        {
            "ID": "00Q4G000019Ke96UAC",
            "Email": "malcolmwebb08@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke97UAC",
            "Email": "office@woughton.org"
        },
        {
            "ID": "00Q4G000019Ke98UAC",
            "Email": "netherfieldsda@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke99UAC",
            "Email": "office.fnlc@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke9AUAS",
            "Email": "office@fleetbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke9BUAS",
            "Email": "stormorechapel@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke9CUAS",
            "Email": "rachbush75@hotmail.co.uk"
        },
        {
            "ID": "00Q4G000019Ke9DUAS",
            "Email": "hopehbc@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke9EUAS",
            "Email": "contactus.gbcbhd@gmail.com "
        },
        {
            "ID": "00Q4G000019Ke9FUAS",
            "Email": "redeemer@redeemerbirmingham.org"
        },
        {
            "ID": "00Q4G000019Ke9GUAS",
            "Email": "contact@goodnewsbrighton.com"
        },
        {
            "ID": "00Q4G000019Ke9HUAS",
            "Email": "brondeschurch@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke9IUAS",
            "Email": "church@siloambaptist.co.uk"
        },
        {
            "ID": "00Q4G000019Ke9JUAS",
            "Email": "info@crawleybaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019Ke9KUAS",
            "Email": "finance@dartmouthbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke9LUAS",
            "Email": " info@forestgatechurch.org "
        },
        {
            "ID": "00Q4G000019Ke9MUAS",
            "Email": "Pastor@greatsampfordbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke9NUAS",
            "Email": "Info@accbrighton.org.uk&#10;"
        },
        {
            "ID": "00Q4G000019Ke9OUAS",
            "Email": " hattersleybaptistchurch@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke9PUAS",
            "Email": "amottbc@hotmail.com"
        },
        {
            "ID": "00Q4G000019Ke9QUAS",
            "Email": "gaerbaptistchurch@virginmedia.com"
        },
        {
            "ID": "00Q4G000019Ke9RUAS",
            "Email": "wilkinsoncarol@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke9SUAS",
            "Email": "glyndwrswaycafe@outlook.com"
        },
        {
            "ID": "00Q4G000019Ke9TUAS",
            "Email": " thornicrofts@btinternet.com "
        },
        {
            "ID": "00Q4G000019Ke9UUAS",
            "Email": "allenbroncksea@blueyonder.co.uk"
        },
        {
            "ID": "00Q4G000019Ke9VUAS",
            "Email": "alphathechapel@yahoo.com"
        },
        {
            "ID": "00Q4G000019Ke9WUAS",
            "Email": "office@jacobswell.org.uk"
        },
        {
            "ID": "00Q4G000019Ke9XUAS",
            "Email": "contact@altonbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke9YUAS",
            "Email": "tomrobb-ronald@talktalk.net"
        },
        {
            "ID": "00Q4G000019Ke9ZUAS",
            "Email": "coningsbybaptistchurch@live.co.uk "
        },
        {
            "ID": "00Q4G000019Ke9aUAC",
            "Email": "cockant2@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke9bUAC",
            "Email": "admin@lswmethodists.org.uk"
        },
        {
            "ID": "00Q4G000019Ke9cUAC",
            "Email": "admin@hamptonwickbaptists.co.uk"
        },
        {
            "ID": "00Q4G000019Ke9dUAC",
            "Email": "admin@kimble-free.co.uk"
        },
        {
            "ID": "00Q4G000019Ke9eUAC",
            "Email": " office@ccrobertsbridge.org.uk"
        },
        {
            "ID": "00Q4G000019Ke9fUAC",
            "Email": "grdnhrbrt@yahoo.co.uk"
        },
        {
            "ID": "00Q4G000019Ke9gUAC",
            "Email": "enquiries@emmanuelshared.church"
        },
        {
            "ID": "00Q4G000019Ke9hUAC",
            "Email": "smith.theshingles@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke9iUAC",
            "Email": "info@coverdalechristianchurch.uk"
        },
        {
            "ID": "00Q4G000019Ke9jUAC",
            "Email": "enquiry@peopleschapel.org.uk   "
        },
        {
            "ID": "00Q4G000019Ke9kUAC",
            "Email": "hendry@telfordmeth.org.uk"
        },
        {
            "ID": "00Q4G000019Ke9lUAC",
            "Email": "ebcbuckley@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke9mUAC",
            "Email": "contact@hwbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019Ke9nUAC",
            "Email": "secretary@chipperfieldbaptistchurch.co.uk"
        },
        {
            "ID": "00Q4G000019Ke9oUAC",
            "Email": "michaelj.collis@outlook.com"
        },
        {
            "ID": "00Q4G000019Ke9pUAC",
            "Email": "holyfamilybbl@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke9qUAC",
            "Email": "dwpurver@aol.com"
        },
        {
            "ID": "00Q4G000019Ke9rUAC",
            "Email": "welcome@stmellonsbaptist.church"
        },
        {
            "ID": "00Q4G000019Ke9sUAC",
            "Email": "barlestonebaptistchurch@outlook.com"
        },
        {
            "ID": "00Q4G000019Ke9tUAC",
            "Email": "boa.baptistchurch@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke9uUAC",
            "Email": "cosbycommchurch@btinternet.com"
        },
        {
            "ID": "00Q4G000019Ke9vUAC",
            "Email": "secretary@thechurchinbinleywoods.org.uk"
        },
        {
            "ID": "00Q4G000019Ke9wUAC",
            "Email": "emmanuelhounslow@googlemail.com"
        },
        {
            "ID": "00Q4G000019Ke9xUAC",
            "Email": "mikeonorme@gmail.com"
        },
        {
            "ID": "00Q4G000019Ke9yUAC",
            "Email": "secretary@christtheservant.org.uk"
        },
        {
            "ID": "00Q4G000019Ke9zUAC",
            "Email": "Derek@bedfordhill.co.uk"
        },
        {
            "ID": "00Q4G000019KeA0UAK",
            "Email": "wardens.beckington@gmail.com"
        },
        {
            "ID": "00Q4G000019KeA1UAK",
            "Email": "vakuru@the-revells.com"
        },
        {
            "ID": "00Q4G000019KeA2UAK",
            "Email": "revgroovie@yahoo.com"
        },
        {
            "ID": "00Q4G000019KeA3UAK",
            "Email": "aepearson@live.co.uk"
        },
        {
            "ID": "00Q4G000019KeIBUA0",
            "Email": "admin@thebridgebaptistchurchgillingham.org.uk"
        },
        {
            "ID": "00Q4G000019KeA4UAK",
            "Email": "baptistchurch@gosberton.org"
        },
        {
            "ID": "00Q4G000019KeA5UAK",
            "Email": "rector@stmarykippax.org.uk"
        },
        {
            "ID": "00Q4G000019KeA6UAK",
            "Email": "info@mvbc.org.uk"
        },
        {
            "ID": "00Q4G000019KeA7UAK",
            "Email": "david.barber@newlifebaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeA8UAK",
            "Email": "info@quaintonbaptistchapel.org"
        },
        {
            "ID": "00Q4G000019KeA9UAK",
            "Email": "office@stevingtonbaptistchurch.org"
        },
        {
            "ID": "00Q4G000019KeAAUA0",
            "Email": "admin@manseltonwelsh.com"
        },
        {
            "ID": "00Q4G000019KeABUA0",
            "Email": "liz.thorp@goldhill.org"
        },
        {
            "ID": "00Q4G000019KeACUA0",
            "Email": "secretary@bethelbaptistchurch.co.uk "
        },
        {
            "ID": "00Q4G000019KeADUA0",
            "Email": "chsec.sandhurstbaptists@gmail.com"
        },
        {
            "ID": "00Q4G000019KeAEUA0",
            "Email": "office@rrbc.org.uk"
        },
        {
            "ID": "00Q4G000019KeAFUA0",
            "Email": "lizcookson@cheniesbaptist.co.uk"
        },
        {
            "ID": "00Q4G000019KeAGUA0",
            "Email": "christinesmithies@goodshawbaptistchurch.org "
        },
        {
            "ID": "00Q4G000019KeAHUA0",
            "Email": "secretary@littlelanechurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeAIUA0",
            "Email": "hazel@parsons-heath.org.uk"
        },
        {
            "ID": "00Q4G000019KeAJUA0",
            "Email": "trinitynfcentre@gmail.com"
        },
        {
            "ID": "00Q4G000019KeAKUA0",
            "Email": "secretary@southashfordbaptist.org.uk "
        },
        {
            "ID": "00Q4G000019KeALUA0",
            "Email": "jackieworthington@gmail.com"
        },
        {
            "ID": "00Q4G000019KeAMUA0",
            "Email": "paulinecopland@blueyonder.co.uk"
        },
        {
            "ID": "00Q4G000019KeANUA0",
            "Email": "cd@chrisden.plus.com"
        },
        {
            "ID": "00Q4G000019KeAOUA0",
            "Email": "rosemarie.morrison88@gmail.com"
        },
        {
            "ID": "00Q4G000019KeAPUA0",
            "Email": "derekcarterwbc@aol.com"
        },
        {
            "ID": "00Q4G000019KeAQUA0",
            "Email": "hbc_treasurer@icloud.com"
        },
        {
            "ID": "00Q4G000019KeARUA0",
            "Email": "msbaptist@btinternet.com"
        },
        {
            "ID": "00Q4G000019KeASUA0",
            "Email": "treasurer@bourtonbaptist.co.uk"
        },
        {
            "ID": "00Q4G000019KeIGUA0",
            "Email": "secretary@melbourn-baptist.org.uk"
        },
        {
            "ID": "00Q4G000019KeATUA0",
            "Email": "Georgeroadcommunitychurch@hotmail.com"
        },
        {
            "ID": "00Q4G000019KeAUUA0",
            "Email": "margaretsoutham1@gmail.com"
        },
        {
            "ID": "00Q4G000019KeAVUA0",
            "Email": "info@highfield-community.org.uk"
        },
        {
            "ID": "00Q4G000019KeAWUA0",
            "Email": "beckyt@beeston-free.org"
        },
        {
            "ID": "00Q4G000019KeAXUA0",
            "Email": "v.wiggins@beaconhouseministries.org.uk"
        },
        {
            "ID": "00Q4G000019KeAYUA0",
            "Email": "aaron@realitychurch.london"
        },
        {
            "ID": "00Q4G000019KeAZUA0",
            "Email": "adam.pannell@ashburnham.org.uk"
        },
        {
            "ID": "00Q4G000019KeAaUAK",
            "Email": "adele.poulson@anglican.org"
        },
        {
            "ID": "00Q4G000019KeAbUAK",
            "Email": "paul@adventist.scot"
        },
        {
            "ID": "00Q4G000019KeAcUAK",
            "Email": "alison@aogcentral.co.uk"
        },
        {
            "ID": "00Q4G000019KeAdUAK",
            "Email": "alison@calderwoodbaptist.co.uk"
        },
        {
            "ID": "00Q4G000019KeAeUAK",
            "Email": "alison@hempstead-essex.org.uk"
        },
        {
            "ID": "00Q4G000019KeAfUAK",
            "Email": "melinda@newcom.church"
        },
        {
            "ID": "00Q4G000019KeAgUAK",
            "Email": "alison@swym.org.uk"
        },
        {
            "ID": "00Q4G000019KeAhUAK",
            "Email": "alison@thecolourministry.co.uk"
        },
        {
            "ID": "00Q4G000019KeAiUAK",
            "Email": "alisonthompson@wirralark.org.uk"
        },
        {
            "ID": "00Q4G000019KeAjUAK",
            "Email": "alyssa@christchurchwalkley.co.uk"
        },
        {
            "ID": "00Q4G000019KeAkUAK",
            "Email": "am@swbc.org.uk"
        },
        {
            "ID": "00Q4G000019KeAlUAK",
            "Email": "office@stlawrencejewry.org.uk"
        },
        {
            "ID": "00Q4G000019KeAmUAK",
            "Email": "amy.adams@methodist.org.uk"
        },
        {
            "ID": "00Q4G000019KeAnUAK",
            "Email": "amy@nccwm.org"
        },
        {
            "ID": "00Q4G000019KeAoUAK",
            "Email": "andrewc@occ.org.uk"
        },
        {
            "ID": "00Q4G000019KeApUAK",
            "Email": "andy.wilson@greenfordbaptist.london"
        },
        {
            "ID": "00Q4G000019KeAqUAK",
            "Email": "andy.kearnes@abch.org.uk"
        },
        {
            "ID": "00Q4G000019KeArUAK",
            "Email": "info@newgen.org.uk"
        },
        {
            "ID": "00Q4G000019KeAsUAK",
            "Email": "angie.chola@mylgcc.com"
        },
        {
            "ID": "00Q4G000019KeAtUAK",
            "Email": "fiance@leightonbaptists.org.uk"
        },
        {
            "ID": "00Q4G000019KeAuUAK",
            "Email": "chris.knight@stbasils.org.uk"
        },
        {
            "ID": "00Q4G000019KeAvUAK",
            "Email": "apotts@stlukeschurch.co.uk"
        },
        {
            "ID": "00Q4G000019KeAwUAK",
            "Email": "ashah@everyday.org.uk"
        },
        {
            "ID": "00Q4G000019KeAxUAK",
            "Email": "ashley.bence@tkc.org.uk"
        },
        {
            "ID": "00Q4G000019KeAyUAK",
            "Email": "ashma.ponniah@cfbmethodistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeAzUAK",
            "Email": "brain.leathem@hopewinchester.org"
        },
        {
            "ID": "00Q4G000019KeB0UAK",
            "Email": "office@smb.org.uk"
        },
        {
            "ID": "00Q4G000019KeB1UAK",
            "Email": "becca.holden@moorlands.org.uk"
        },
        {
            "ID": "00Q4G000019KeB2UAK",
            "Email": "beckym@jpc.org.uk"
        },
        {
            "ID": "00Q4G000019KeB3UAK",
            "Email": "bencook@christchurchcambridge.org.uk"
        },
        {
            "ID": "00Q4G000019KeB4UAK",
            "Email": "beth@churchcentral.org.uk"
        },
        {
            "ID": "00Q4G000019KeB5UAK",
            "Email": "beverley.hodges@walthamabbeychurch.co.uk"
        },
        {
            "ID": "00Q4G000019KeB6UAK",
            "Email": "bmacleod@mjchurch.com"
        },
        {
            "ID": "00Q4G000019KeB7UAK",
            "Email": "bob.chappell@barhillchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeB8UAK",
            "Email": "brenda@tntministries.org.uk"
        },
        {
            "ID": "00Q4G000019KeB9UAK",
            "Email": "brianstickland@oatlandschurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeBAUA0",
            "Email": "bruce.gardiner-crehan@citychurchbelfast.org"
        },
        {
            "ID": "00Q4G000019KeBBUA0",
            "Email": "info@uccf.org.uk"
        },
        {
            "ID": "00Q4G000019KeBCUA0",
            "Email": "carol@ccorpington.org"
        },
        {
            "ID": "00Q4G000019KeBDUA0",
            "Email": "caroline@mulbchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeBEUA0",
            "Email": "cathy.leese@kingsarms.org"
        },
        {
            "ID": "00Q4G000019KeBFUA0",
            "Email": "catriona.robertson@christianmuslimforum.org"
        },
        {
            "ID": "00Q4G000019KeBGUA0",
            "Email": "catriona@freechurch.org"
        },
        {
            "ID": "00Q4G000019KeBHUA0",
            "Email": "celia.hudson@licc.org.uk"
        },
        {
            "ID": "00Q4G000019KeBIUA0",
            "Email": "charly.robinson@centralvineyard.co.uk"
        },
        {
            "ID": "00Q4G000019KeBJUA0",
            "Email": "cheryl@nccc.org.au"
        },
        {
            "ID": "00Q4G000019KeBKUA0",
            "Email": "chloe.satchell-cobbett@maybridge.org.uk"
        },
        {
            "ID": "00Q4G000019KeBLUA0",
            "Email": "chloe@vinelife.co.uk"
        },
        {
            "ID": "00Q4G000019KeBMUA0",
            "Email": "chris.foote@allnationselim.org"
        },
        {
            "ID": "00Q4G000019KeBNUA0",
            "Email": "david.mclellan@christchurchbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019KeBOUA0",
            "Email": "chris@kingschurchedinburgh.org"
        },
        {
            "ID": "00Q4G000019KeBPUA0",
            "Email": "chris@stbc.org.uk"
        },
        {
            "ID": "00Q4G000019KeBQUA0",
            "Email": "christian@citychurchsheffield.org.uk"
        },
        {
            "ID": "00Q4G000019KeBRUA0",
            "Email": "christina@mosaic.org"
        },
        {
            "ID": "00Q4G000019KeBSUA0",
            "Email": "christine.elliott@cte.org.uk"
        },
        {
            "ID": "00Q4G000019KeBTUA0",
            "Email": "christine@cca.uk.net"
        },
        {
            "ID": "00Q4G000019KeBUUA0",
            "Email": "claire.rushton@churchofengland.org"
        },
        {
            "ID": "00Q4G000019KeBVUA0",
            "Email": "claude.lobo@stfaith.com"
        },
        {
            "ID": "00Q4G000019KeBWUA0",
            "Email": "clive@pcusa.org"
        },
        {
            "ID": "00Q4G000019KeBXUA0",
            "Email": "dalton.smith@mpowerministries.org"
        },
        {
            "ID": "00Q4G000019KeBYUA0",
            "Email": "daniel@cca.uk.net"
        },
        {
            "ID": "00Q4G000019KeBZUA0",
            "Email": "david.wooldridge@newlifechurch.co.uk"
        },
        {
            "ID": "00Q4G000019KeBaUAK",
            "Email": "dave.carter@thecitychurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeBbUAK",
            "Email": "dave@willowfieldchurch.co.uk"
        },
        {
            "ID": "00Q4G000019KeBcUAK",
            "Email": "david.deng@ecn.org.uk"
        },
        {
            "ID": "00Q4G000019KeBdUAK",
            "Email": "david@aslanchristianbooks.com"
        },
        {
            "ID": "00Q4G000019KeBeUAK",
            "Email": "davidash@jubilee.org.uk"
        },
        {
            "ID": "00Q4G000019KeBfUAK",
            "Email": "davidsharpe@audaciouschurch.com"
        },
        {
            "ID": "00Q4G000019KeBgUAK",
            "Email": "debbie.laycock@ichthusforesthill.com"
        },
        {
            "ID": "00Q4G000019KeBhUAK",
            "Email": "df@gvc.org.uk"
        },
        {
            "ID": "00Q4G000019KeBiUAK",
            "Email": "diane@christianeducation.org.uk"
        },
        {
            "ID": "00Q4G000019KeBjUAK",
            "Email": "diane@highkirk.org.uk"
        },
        {
            "ID": "00Q4G000019KeBkUAK",
            "Email": "helen@newtownbredabaptist.com"
        },
        {
            "ID": "00Q4G000019KeBlUAK",
            "Email": "dianepaddon@christchurchdownend.com"
        },
        {
            "ID": "00Q4G000019KeBmUAK",
            "Email": "dudley@contagious.org.uk"
        },
        {
            "ID": "00Q4G000019KeBnUAK",
            "Email": "dwatson@lds.org"
        },
        {
            "ID": "00Q4G000019KeBoUAK",
            "Email": "ed@woodlandschurch.net"
        },
        {
            "ID": "00Q4G000019KeBpUAK",
            "Email": "elise@christchurchlondon.org"
        },
        {
            "ID": "00Q4G000019KeBqUAK",
            "Email": "elizabeth@bcchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeBrUAK",
            "Email": "ellie.bedford@chanctonbury.org.uk"
        },
        {
            "ID": "00Q4G000019KeBsUAK",
            "Email": "emilie.radford@staldates.org.uk"
        },
        {
            "ID": "00Q4G000019KeBtUAK",
            "Email": "eric@gbtc.org.uk"
        },
        {
            "ID": "00Q4G000019KeBuUAK",
            "Email": "oluteyed@jesushouse.org.uk"
        },
        {
            "ID": "00Q4G000019KeBvUAK",
            "Email": "dave@ccbs.org.uk"
        },
        {
            "ID": "00Q4G000019KeBwUAK",
            "Email": "f.nassar@cmcsoxford.org.uk"
        },
        {
            "ID": "00Q4G000019KeBxUAK",
            "Email": "faiza.mwangola@stbarnabasdulwich.org"
        },
        {
            "ID": "00Q4G000019KeByUAK",
            "Email": "jonwooden@allsoulschurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeBzUAK",
            "Email": "fiona@ctfc.org.uk"
        },
        {
            "ID": "00Q4G000019KeC0UAK",
            "Email": "glynis@loughtonmethodist.org.uk"
        },
        {
            "ID": "00Q4G000019KeC1UAK",
            "Email": "procurement@methodistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeC2UAK",
            "Email": "info@kerith.church"
        },
        {
            "ID": "00Q4G000019KeC3UAK",
            "Email": "gavin.duignan@icsfurniture.com"
        },
        {
            "ID": "00Q4G000019KeC4UAK",
            "Email": "gbrazeau@grandviewchurch.ca"
        },
        {
            "ID": "00Q4G000019KeC5UAK",
            "Email": "gchristie@churchofscotland.org.uk"
        },
        {
            "ID": "00Q4G000019KeC6UAK",
            "Email": "gduffin@loanheadparishchurch.co.uk"
        },
        {
            "ID": "00Q4G000019KeC7UAK",
            "Email": "gillian.armitt@eyam-church.org"
        },
        {
            "ID": "00Q4G000019KeC8UAK",
            "Email": "office@stjohnswimborne.org.uk"
        },
        {
            "ID": "00Q4G000019KeC9UAK",
            "Email": "glen.johns@chacewater.net"
        },
        {
            "ID": "00Q4G000019KeCAUA0",
            "Email": "graham.vince@strettonparish.org.uk"
        },
        {
            "ID": "00Q4G000019KeCBUA0",
            "Email": "graham@centrechurch.uk"
        },
        {
            "ID": "00Q4G000019KeCCUA0",
            "Email": "graham@christchurchkensington.com"
        },
        {
            "ID": "00Q4G000019KeCDUA0",
            "Email": "harrisonl@dunglassestate.com"
        },
        {
            "ID": "00Q4G000019KeCEUA0",
            "Email": "heather@goodshepherdchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeCFUA0",
            "Email": "heather@powerpackministries.co.uk"
        },
        {
            "ID": "00Q4G000019KeCGUA0",
            "Email": "heidi@comchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeCHUA0",
            "Email": "lara@scunthorpebaptist.co.uk"
        },
        {
            "ID": "00Q4G000019KeCIUA0",
            "Email": "helen.lotwick@bathcitychurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeCJUA0",
            "Email": "helen.paget@lanarkgreyfriars.com"
        },
        {
            "ID": "00Q4G000019KeCKUA0",
            "Email": "shirley.leslie@ashfordchurches.co.uk"
        },
        {
            "ID": "00Q4G000019KeCLUA0",
            "Email": "howardgiles@streathambaptist.com"
        },
        {
            "ID": "00Q4G000019KeCMUA0",
            "Email": "ian@antiochsheffield.org.uk"
        },
        {
            "ID": "00Q4G000019KeCNUA0",
            "Email": "ian@firstlisburn.org"
        },
        {
            "ID": "00Q4G000019KeCOUA0",
            "Email": "ian@utusheffield.org.uk"
        },
        {
            "ID": "00Q4G000019KeCPUA0",
            "Email": "tony@nottinghillmc.org.uk"
        },
        {
            "ID": "00Q4G000019KeCQUA0",
            "Email": "isobel.macfarlane@dalgety-church.org.uk"
        },
        {
            "ID": "00Q4G000019KeCRUA0",
            "Email": "h.inglis@alabare.co.uk"
        },
        {
            "ID": "00Q4G000019KeCSUA0",
            "Email": "j.thompson@innchurches.co.uk"
        },
        {
            "ID": "00Q4G000019KeCTUA0",
            "Email": "jack@bptax.co.uk"
        },
        {
            "ID": "00Q4G000019KeCUUA0",
            "Email": "jackie.turner@guildfordcommunitychurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeCVUA0",
            "Email": "jackie@cchm.org.uk"
        },
        {
            "ID": "00Q4G000019KeCWUA0",
            "Email": "jacqueline.crow@stjohnsdukinfield.com"
        },
        {
            "ID": "00Q4G000019KeCXUA0",
            "Email": "jacquie.channell@addlestonebaptist.org.uk"
        },
        {
            "ID": "00Q4G000019KeCYUA0",
            "Email": "james.irving@stbrides.com"
        },
        {
            "ID": "00Q4G000019KeCZUA0",
            "Email": "office@cockfosters.church"
        },
        {
            "ID": "00Q4G000019KeCaUAK",
            "Email": "james@christchurchsouthampton.org.uk"
        },
        {
            "ID": "00Q4G000019KeCbUAK",
            "Email": "jamesanthony@gatechurch.co.uk"
        },
        {
            "ID": "00Q4G000019KeCcUAK",
            "Email": "jamie@journeytn.com"
        },
        {
            "ID": "00Q4G000019KeCdUAK",
            "Email": "janice.hawketts@bridgebuilderstrust.org.uk"
        },
        {
            "ID": "00Q4G000019KeCeUAK",
            "Email": "jason.gibson@groundlevel.org.uk"
        },
        {
            "ID": "00Q4G000019KeCfUAK",
            "Email": "jason@gpastures.co.uk"
        },
        {
            "ID": "00Q4G000019KeCgUAK",
            "Email": "jdeacon@buckfast.org.uk"
        },
        {
            "ID": "00Q4G000019KeChUAK",
            "Email": "jean.postlethwaite@gunnersburybaptistchurch.org"
        },
        {
            "ID": "00Q4G000019KeCiUAK",
            "Email": "general.manager@hebronhall.org"
        },
        {
            "ID": "00Q4G000019KeCjUAK",
            "Email": "jenny.holmes@trendlewoodchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeCkUAK",
            "Email": "jenny@level10.church"
        },
        {
            "ID": "00Q4G000019KeClUAK",
            "Email": "jenny@scottishbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019KeCmUAK",
            "Email": "jenny@thelifechurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeCnUAK",
            "Email": "jenny@wrbc.org.uk"
        },
        {
            "ID": "00Q4G000019KeCoUAK",
            "Email": "jim.banaghan@stjamespriory.org.uk"
        },
        {
            "ID": "00Q4G000019KeCpUAK",
            "Email": "jimrobson@riccartonparishchurch.co.uk"
        },
        {
            "ID": "00Q4G000019KeCqUAK",
            "Email": "jo.newall@johnkeble.org.uk"
        },
        {
            "ID": "00Q4G000019KeCrUAK",
            "Email": "joe.robertson@thecitychurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeCsUAK",
            "Email": "ruth.nott@inhope.uk"
        },
        {
            "ID": "00Q4G000019KeCtUAK",
            "Email": "jono@emmanuelcanterbury.org.uk"
        },
        {
            "ID": "00Q4G000019KeCuUAK",
            "Email": "joy@alivechurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeCvUAK",
            "Email": "joyce.millar@knockpresbyterian.church"
        },
        {
            "ID": "00Q4G000019KeCwUAK",
            "Email": "ben.daniel@care.org.uk"
        },
        {
            "ID": "00Q4G000019KeCxUAK",
            "Email": "judi@theccat.com"
        },
        {
            "ID": "00Q4G000019KeCyUAK",
            "Email": "julia@gkopc.co.uk"
        },
        {
            "ID": "00Q4G000019KeCzUAK",
            "Email": "julia@gracechurchexeter.org"
        },
        {
            "ID": "00Q4G000019KeD0UAK",
            "Email": "julia@thehouseministry.co.uk"
        },
        {
            "ID": "00Q4G000019KeD1UAK",
            "Email": "june.emmerson@tamworth-elim.org.uk"
        },
        {
            "ID": "00Q4G000019KeD2UAK",
            "Email": "karen.kinder@bhcgodalming.org"
        },
        {
            "ID": "00Q4G000019KeD3UAK",
            "Email": "admin@ashfordvineyard.org"
        },
        {
            "ID": "00Q4G000019KeD4UAK",
            "Email": "karenbennett@ilssm.org.uk"
        },
        {
            "ID": "00Q4G000019KeD5UAK",
            "Email": "karend@wottonbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019KeD6UAK",
            "Email": "gemma.williams@southwark.anglican.org"
        },
        {
            "ID": "00Q4G000019KeD7UAK",
            "Email": "kate@wccm.org"
        },
        {
            "ID": "00Q4G000019KeD8UAK",
            "Email": "garry.smith@woodside.com"
        },
        {
            "ID": "00Q4G000019KeD9UAK",
            "Email": "kevin.bell@allhallowstwick.org.uk"
        },
        {
            "ID": "00Q4G000019KeDAUA0",
            "Email": "treasure@windleshamchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeDBUA0",
            "Email": "kim@swmtc.org.uk"
        },
        {
            "ID": "00Q4G000019KeDCUA0",
            "Email": "hello@wearelifespring.church"
        },
        {
            "ID": "00Q4G000019KeDDUA0",
            "Email": "laura@myrevelationchurch.com"
        },
        {
            "ID": "00Q4G000019KeDEUA0",
            "Email": "chris.rogers@sjp.org.uk"
        },
        {
            "ID": "00Q4G000019KeDFUA0",
            "Email": "lisa@crownjesus.org"
        },
        {
            "ID": "00Q4G000019KeDGUA0",
            "Email": "liz.davies@christchurchmayfair.org"
        },
        {
            "ID": "00Q4G000019KeDHUA0",
            "Email": "liz@bbministries.org.uk"
        },
        {
            "ID": "00Q4G000019KeDIUA0",
            "Email": "louise.mcmahon@northern.org.uk"
        },
        {
            "ID": "00Q4G000019KeDJUA0",
            "Email": "chris@lifespringchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeDKUA0",
            "Email": "lucy@c-y-m.org.uk"
        },
        {
            "ID": "00Q4G000019KeDLUA0",
            "Email": "mark@cambray.org"
        },
        {
            "ID": "00Q4G000019KeDMUA0",
            "Email": "mark@pioneers-uk.org"
        },
        {
            "ID": "00Q4G000019KeDNUA0",
            "Email": "martin.hamblin@bhpurc.org.uk"
        },
        {
            "ID": "00Q4G000019KeDOUA0",
            "Email": "mary.hetherington@stjamescarlisle.org.uk"
        },
        {
            "ID": "00Q4G000019KeDPUA0",
            "Email": "mary.t@hopecity.com"
        },
        {
            "ID": "00Q4G000019KeDQUA0",
            "Email": "matt.irons@wesleyhall.org.uk"
        },
        {
            "ID": "00Q4G000019KeDRUA0",
            "Email": "bex.campbell@stgeorgesleeds.org.uk"
        },
        {
            "ID": "00Q4G000019KeDSUA0",
            "Email": "michael@kilkeelpc.com"
        },
        {
            "ID": "00Q4G000019KeDTUA0",
            "Email": "office@methodistmaidenhead.org.uk"
        },
        {
            "ID": "00Q4G000019KeDUUA0",
            "Email": "reception@st-helens.org.uk"
        },
        {
            "ID": "00Q4G000019KeDVUA0",
            "Email": "miranda@psandgs.org.uk"
        },
        {
            "ID": "00Q4G000019KeDWUA0",
            "Email": "molly.watts@precept.org.uk"
        },
        {
            "ID": "00Q4G000019KeDXUA0",
            "Email": "monty@amchurch.co.uk"
        },
        {
            "ID": "00Q4G000019KeDYUA0",
            "Email": "morag.kelso@lanarkgreyfriars.com"
        },
        {
            "ID": "00Q4G000019KeDZUA0",
            "Email": "morven.noble@dcfchurch.org"
        },
        {
            "ID": "00Q4G000019KeDaUAK",
            "Email": "office@chatsworthbaptist.co.uk"
        },
        {
            "ID": "00Q4G000019KeDbUAK",
            "Email": "n_pogmore@elim.org.uk"
        },
        {
            "ID": "00Q4G000019KeDcUAK",
            "Email": "nbutler@llanishenbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019KeDdUAK",
            "Email": "ness@openheaven.org"
        },
        {
            "ID": "00Q4G000019KeDeUAK",
            "Email": "ngozi@jubileechurchlondon.org"
        },
        {
            "ID": "00Q4G000019KeDfUAK",
            "Email": "nikos.paplomatas@wesleymem.org.uk"
        },
        {
            "ID": "00Q4G000019KeDgUAK",
            "Email": "nk@ecc.org.uk"
        },
        {
            "ID": "00Q4G000019KeDhUAK",
            "Email": "noel@junctionchurch.net"
        },
        {
            "ID": "00Q4G000019KeDiUAK",
            "Email": "norma@palmerstonplacechurch.com"
        },
        {
            "ID": "00Q4G000019KeDjUAK",
            "Email": "olly@bpchurch.uk"
        },
        {
            "ID": "00Q4G000019KeDkUAK",
            "Email": "p.ferguson@thornburybaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeDlUAK",
            "Email": "pam.jones@niscu.org.uk"
        },
        {
            "ID": "00Q4G000019KeDmUAK",
            "Email": "pat.ray@huffmanbaptist.org"
        },
        {
            "ID": "00Q4G000019KeDnUAK",
            "Email": "parish.office@stmaryredcliffe.co.uk"
        },
        {
            "ID": "00Q4G000019KeDoUAK",
            "Email": "paul.gutteridge@freechurches.org.uk"
        },
        {
            "ID": "00Q4G000019KeDuUAK",
            "Email": "paul.houiellebecq@watoto.com"
        },
        {
            "ID": "00Q4G000019KeDvUAK",
            "Email": "paulhughes@strichardshanworth.org"
        },
        {
            "ID": "00Q4G000019KeDwUAK",
            "Email": "pearl@mytonchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeDxUAK",
            "Email": "penny.campbell@thecitychurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeDyUAK",
            "Email": "penny.oxley@bassenfell.org.uk"
        },
        {
            "ID": "00Q4G000019KeDzUAK",
            "Email": "pete.goldring@restorecc.org.uk"
        },
        {
            "ID": "00Q4G000019KeE0UAK",
            "Email": "parishclerkstmarks@gmail.com"
        },
        {
            "ID": "00Q4G000019KeE1UAK",
            "Email": "peteoakley@pulseministries.org.uk"
        },
        {
            "ID": "00Q4G000019KeE2UAK",
            "Email": "peter.martin@essentialchristian.org"
        },
        {
            "ID": "00Q4G000019KeE3UAK",
            "Email": "peter.thatcher@bluntishambaptist.org"
        },
        {
            "ID": "00Q4G000019KeE4UAK",
            "Email": "peter@aylshamcommunitychurch.org"
        },
        {
            "ID": "00Q4G000019KeE5UAK",
            "Email": "peter@litchardmission.co.uk"
        },
        {
            "ID": "00Q4G000019KeE6UAK",
            "Email": "office@yorkcitychurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeE7UAK",
            "Email": "philip@decisiontimeministries.co.uk"
        },
        {
            "ID": "00Q4G000019KeE8UAK",
            "Email": "pwoodhouse-severn@oldbramptonchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeE9UAK",
            "Email": "parishoffice@oatlandschurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeEAUA0",
            "Email": "rhicks@thurrockcf.org.uk"
        },
        {
            "ID": "00Q4G000019KeEBUA0",
            "Email": "richard.coekin@dundonald.org"
        },
        {
            "ID": "00Q4G000019KeECUA0",
            "Email": "richard.moy@christchurchw4.com"
        },
        {
            "ID": "00Q4G000019KeEDUA0",
            "Email": "office@loughtonbaptistchurch.org"
        },
        {
            "ID": "00Q4G000019KeEEUA0",
            "Email": "richard@siloam.org.uk"
        },
        {
            "ID": "00Q4G000019KeEFUA0",
            "Email": "hello@lovechurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeEGUA0",
            "Email": "robert@elimcarlisle.org"
        },
        {
            "ID": "00Q4G000019KeEHUA0",
            "Email": "rod.keane@khccc.com"
        },
        {
            "ID": "00Q4G000019KeEIUA0",
            "Email": "chrisl@christchurchhailsham.org"
        },
        {
            "ID": "00Q4G000019KeEJUA0",
            "Email": "roseanna@enc.uk.net"
        },
        {
            "ID": "00Q4G000019KeEKUA0",
            "Email": "rosslyn@oakhallchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeELUA0",
            "Email": "pamelahatt@abovebarchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeEMUA0",
            "Email": "rparrant@st-alfege.org"
        },
        {
            "ID": "00Q4G000019KeENUA0",
            "Email": "ruth.gilson@gb-ministries.org"
        },
        {
            "ID": "00Q4G000019KeEOUA0",
            "Email": "ruth@stdionis.org.uk"
        },
        {
            "ID": "00Q4G000019KeEPUA0",
            "Email": "ruth@stsilas.org.uk"
        },
        {
            "ID": "00Q4G000019KeEQUA0",
            "Email": "s.wallis@grosvenorchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeERUA0",
            "Email": "s_lewin@elim.org.uk"
        },
        {
            "ID": "00Q4G000019KeESUA0",
            "Email": "sally@city-church.co.uk"
        },
        {
            "ID": "00Q4G000019KeETUA0",
            "Email": "samantha.topcu@egcc.co.uk"
        },
        {
            "ID": "00Q4G000019KeEUUA0",
            "Email": "sandra.harrison@chch.ox.ac.uk"
        },
        {
            "ID": "00Q4G000019KeEVUA0",
            "Email": "sarah.lightfoot@fulwoodchurch.co.uk"
        },
        {
            "ID": "00Q4G000019KeEWUA0",
            "Email": "sarah.morter@cromer-church.org.uk"
        },
        {
            "ID": "00Q4G000019KeEXUA0",
            "Email": "sarah.pearson@cbcew.org.uk"
        },
        {
            "ID": "00Q4G000019KeEYUA0",
            "Email": "julian.rowlandson@greyfrairschurch.org"
        },
        {
            "ID": "00Q4G000019KeEZUA0",
            "Email": "sarah@christchurchbalham.org.uk"
        },
        {
            "ID": "00Q4G000019KeEaUAK",
            "Email": "sarah@standrewsbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019KeEbUAK",
            "Email": "sarah@stbenedictbiscop.org.uk"
        },
        {
            "ID": "00Q4G000019KeEcUAK",
            "Email": "sarasarjeant@chawnhillchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeEdUAK",
            "Email": "sboyd@stpauls.co.uk"
        },
        {
            "ID": "00Q4G000019KeEeUAK",
            "Email": "scott@freechurch.org"
        },
        {
            "ID": "00Q4G000019KeEfUAK",
            "Email": "chris.ladner@parishofboston.co.uk"
        },
        {
            "ID": "00Q4G000019KeEgUAK",
            "Email": "che.bourke@rolcc.org.uk"
        },
        {
            "ID": "00Q4G000019KeEhUAK",
            "Email": "sharon.robinson@charleschurch.com"
        },
        {
            "ID": "00Q4G000019KeEiUAK",
            "Email": "sharon@longtoncommunitychurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeEjUAK",
            "Email": "info@christian.org.uk"
        },
        {
            "ID": "00Q4G000019KeEkUAK",
            "Email": "simon.overend@keswickministries.org"
        },
        {
            "ID": "00Q4G000019KeElUAK",
            "Email": "simon@thcc.org.uk"
        },
        {
            "ID": "00Q4G000019KeEmUAK",
            "Email": "sofia.lesiuk@trclondon.org"
        },
        {
            "ID": "00Q4G000019KeEnUAK",
            "Email": "sophie@capcitycardiff.org.uk"
        },
        {
            "ID": "00Q4G000019KeEoUAK",
            "Email": "molina@kenbaptist.org"
        },
        {
            "ID": "00Q4G000019KeEpUAK",
            "Email": "steveycater@westwoodchurch.co.uk"
        },
        {
            "ID": "00Q4G000019KeEqUAK",
            "Email": "office@kpc.org.uk"
        },
        {
            "ID": "00Q4G000019KeErUAK",
            "Email": "stuart.dawson@churchofengland.org"
        },
        {
            "ID": "00Q4G000019KeEsUAK",
            "Email": "sue@oakhamteam.uk"
        },
        {
            "ID": "00Q4G000019KeEtUAK",
            "Email": "heidi@stmaryslondon.com"
        },
        {
            "ID": "00Q4G000019KeEuUAK",
            "Email": "michele@christcentralchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeEvUAK",
            "Email": "susie.white@mycommunitychurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeEwUAK",
            "Email": "sylvia.drummond@equipperschurch.com"
        },
        {
            "ID": "00Q4G000019KeExUAK",
            "Email": "terry.hill@fcagroup.com"
        },
        {
            "ID": "00Q4G000019KeEyUAK",
            "Email": "roger@cmm.org.uk"
        },
        {
            "ID": "00Q4G000019KeEzUAK",
            "Email": "tim@timherriottenterprises.co.uk"
        },
        {
            "ID": "00Q4G000019KeF0UAK",
            "Email": "tracy.ellison@carrickfergusbaptist.com"
        },
        {
            "ID": "00Q4G000019KeF1UAK",
            "Email": "valerie.l@designministry.com"
        },
        {
            "ID": "00Q4G000019KeF2UAK",
            "Email": "wendy@belfastcityvineyard.com"
        },
        {
            "ID": "00Q4G000019KeF3UAK",
            "Email": "wendy@tcolondon.com"
        },
        {
            "ID": "00Q4G000019KeF4UAK",
            "Email": "admin@bowdonchurch.org"
        },
        {
            "ID": "00Q4G000019KeF5UAK",
            "Email": "william@riversidevineyard.com"
        },
        {
            "ID": "00Q4G000019KeF6UAK",
            "Email": "yvonne.sired@urc.org.uk"
        },
        {
            "ID": "00Q4G000019KeF7UAK",
            "Email": "zepur.kiledjian@armenianchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeF8UAK",
            "Email": "zoebell@berkswellchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeF9UAK",
            "Email": "clint@cca.uk.net"
        },
        {
            "ID": "00Q4G000019KeFAUA0",
            "Email": "facilities@churchmissionsociety.org"
        },
        {
            "ID": "00Q4G000019KeFBUA0",
            "Email": "sdeeks@churchofscotland.org.uk"
        },
        {
            "ID": "00Q4G000019KeFCUA0",
            "Email": "office@farnhamvineyard.org.uk"
        },
        {
            "ID": "00Q4G000019KeFDUA0",
            "Email": "tim@fiec.org.uk"
        },
        {
            "ID": "00Q4G000019KeFEUA0",
            "Email": "maywinham@ics-uk.org"
        },
        {
            "ID": "00Q4G000019KeFFUA0",
            "Email": "pmckendrick@nazarene.ac.uk"
        },
        {
            "ID": "00Q4G000019KeFGUA0",
            "Email": "treasurer@stocktonparishchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeFHUA0",
            "Email": "revadrianmanning@gmail.com"
        },
        {
            "ID": "00Q4G000019KeFIUA0",
            "Email": "david@orangefield.org.uk"
        },
        {
            "ID": "00Q4G000019KeFJUA0",
            "Email": "traceynebc@live.com"
        },
        {
            "ID": "00Q4G000019KeFKUA0",
            "Email": "david@clift.me.uk"
        },
        {
            "ID": "00Q4G000019KeFLUA0",
            "Email": "paul@puercondultants.co.uk"
        },
        {
            "ID": "00Q4G000019KeFMUA0",
            "Email": "elizgibson3@gmail.co.uk"
        },
        {
            "ID": "00Q4G000019KeFNUA0",
            "Email": "whbcar2017@gmail.com"
        },
        {
            "ID": "00Q4G000019KeFOUA0",
            "Email": "info@bowbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019KeFPUA0",
            "Email": "rodlangston41@googlemail.com"
        },
        {
            "ID": "00Q4G000019KeFQUA0",
            "Email": "vitecass@aol.com"
        },
        {
            "ID": "00Q4G000019KeFRUA0",
            "Email": "terry.law@newlifebaptistchurch.org.uk"
        },
        {
            "ID": "00Q4G000019KeFSUA0",
            "Email": "theeastsidecentre@btinternet.com"
        },
        {
            "ID": "00Q4G000019KeFTUA0",
            "Email": "tom.cox@oadbybaptist.church"
        },
        {
            "ID": "00Q4G000019KeFUUA0",
            "Email": "marianrickman03@tiscali.co.uk"
        },
        {
            "ID": "00Q4G000019KeFVUA0",
            "Email": "hamiltonaj@virginmedia.com"
        },
        {
            "ID": "00Q4G000019KeFWUA0",
            "Email": "admin@bottesfordbaptistchurch.com"
        },
        {
            "ID": "00Q4G000019KeFXUA0",
            "Email": "eileen.hori@stasbaptist.org"
        },
        {
            "ID": "00Q4G000019KeFYUA0",
            "Email": "joan.rodway@talktalk.net"
        },
        {
            "ID": "00Q4G000019KeFZUA0",
            "Email": "pastor@warleybaptist.org.uk"
        },
        {
            "ID": "00Q4G000019KeFaUAK",
            "Email": "treasurer@trinitybaptistgorton.org"
        },
        {
            "ID": "00Q4G000019KeFbUAK",
            "Email": "stephenekins@sky.com"
        },
        {
            "ID": "00Q4G000019KeFcUAK",
            "Email": "trish.fox63@gmail.com"
        },
        {
            "ID": "00Q4G000019KeFdUAK",
            "Email": "alexappiah@aol.com"
        },
        {
            "ID": "00Q4G000019KeFeUAK",
            "Email": "davidgoddard@rayleighbaptist.org.uk"
        },
        {
            "ID": "00Q4G000019KeFfUAK",
            "Email": "i.dent@icloud.com"
        },
        {
            "ID": "00Q4G000019KeFgUAK",
            "Email": "brianandpatbox@yahoo.co.uk"
        },
        {
            "ID": "00Q4G000019KeFhUAK",
            "Email": "israelolofinjana@yahoo.co.uk"
        },
        {
            "ID": "00Q4G000019KeFiUAK",
            "Email": "john.hewinson@gmail.com"
        },
        {
            "ID": "00Q4G000019KeFjUAK",
            "Email": "info@onechurchbrighton.org"
        },
        {
            "ID": "00Q4G000019KeFkUAK",
            "Email": "tony@tonyjopson.co.uk"
        },
        {
            "ID": "00Q4G000019KeIfUAK",
            "Email": "finance@kirbyfree.org"
        },
        {
            "ID": "00Q4G000019KeIgUAK",
            "Email": "minister@yardleybaptist.co.uk"
        },
        {
            "ID": "00Q4G000019KeIhUAK",
            "Email": "heathergentry@blueyonder.co.uk"
        },
        {
            "ID": "00Q4G000019KeIiUAK",
            "Email": "dnyaneshwar@scriptlanes.com"
        }
    ]

exports.addPardotEmail = function(req, res) {
    console.log('in add');
    var info = req.body;
    info.createdDate = new Date();
    info.updatedDate = new Date();
    for(var i=0;i<pardotJSON.length;i++) {
        var info = pardotJSON[i];
        db.collection('emailwithpardot', function (err, collection) {
            collection.insert(info, { safe: true }, function (err, result) {
                if (err) {
                    res.send({ 'status': 'error', 'message': 'An error has occurred' });
                }
                else {
                    console.log(result);
                    res.send({code: 200, result:result});
                }
            });
        });
    }
    
}

exports.sendLOAmail = function(req, res) {
    var htmlFormat = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /><title>Utility Aid</title><base href="/" /><meta name="viewport" content="width=device-width, initial-scale=1" /><link rel="icon" type="image/x-icon" href="favicon.ico" /></head><body><table><tr><td> Hi,</td></tr><tr><td> Please find attached the letters of authority, to be signed, dated, and printed onto your own letter headed paper. Please return these to baptist@utility-aid.co.uk along with a recent electricity/gas bill</td></tr><tr><td> Kind Regards</td></tr><tr><td> Utility Aid</td></tr></table></body></html>'
    var mailOptions = {
        from: 'Utility Aid', // sender address
        //to: 'enquiries@utility-aid.co.uk,gary@viva-worldwide.com,mdaly@utility-aid.com,WCampbell@utility-aid.co.uk', // list of receivers
        to: req.body.email,
        subject: 'LOA Template', // Subject line
        text: '', // plaintext body
        html: htmlFormat,
        attachments: [{
            // filename: req.body.filename,
            path: 'http://utility-aid.co.uk/LOA-Templates.zip'
            // path: 'https://en.defacto.nl/images/social/demo-1200x630-b3c5c9a1.png'
        }]
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
        db.collection('emailwithpardot', function (err, collection) {
            let info = {
                Email: req.body.email,
                ID: req.body.ID,
                loasent: true,
                addtocall: req.body.addtocall
            }
            collection.update({ 'ID': req.body.ID }, info, { safe: true }, function (err, result) {
                if (err) {
                    res.send({ 'status': 'error', 'message': 'An error has occurred' });
                }
                else {
                    console.log(result);
                    res.send({ 'status': 'success', 'message': 'Data Updated successfully' });
                }
            });
        });
        // res.send({code: 200, message: "Mail sent"});

    });
}

exports.changeAddtoCallStatusPardotEmail = function(req, res) {
    db.collection('emailwithpardot', function (err, collection) {
        let info = {
            Email: req.body.email,
            ID: req.body.ID,
            addtocall: true,
            loasent: req.body.loasent,
        }
        collection.update({ 'ID': req.body.ID }, info, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'status': 'error', 'message': 'An error has occurred' });
            }
            else {
                console.log(result);
                res.send({ 'status': 'success', 'message': 'Data Updated successfully' });
            }
        });
    });
}


/*=================================================
 * ua-energy API calls ends here
 * =================================================*/