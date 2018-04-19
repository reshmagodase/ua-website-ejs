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
        collection.insert(array, {safe: true}, function (err, result) {
            if (err) {
                /*res.send({
                 'status': 'error',
                 'message': 'An error has occurred'
                 });*/
                res.send(err);
            } else {
                if (count == 0) {
                    console.log('Success: ' + JSON.stringify(result));
                    res.send({'status': 'success', 'message': "Data Uploaded Successfully"});
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
        collection.find().limit(20).sort({'createdDate': -1}).toArray(function (err, items) {

            if (err) {
                res.send({'error': 'An error has occurred'})
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
        collection.find().sort({'createdDate': -1}).toArray(function (err, items) {

            if (err) {
                res.send({'error': 'An error has occurred'})
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
        collection.insert(array, {safe: true}, function (err, result) {
            if (err) {
                /*res.send({
                 'status': 'error',
                 'message': 'An error has occurred'
                 });*/
                res.send(err);
            } else {
                /*if (count == 0) {*/
                console.log('Success: ' + JSON.stringify(result));
                res.send({'status': 'success', 'message': "Data Uploaded Successfully"});
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
        collection.insert(array, {safe: true}, function (err, result) {
            if (err) {
                /*res.send({
                 'status': 'error',
                 'message': 'An error has occurred'
                 });*/
                res.send(err);
            } else {
                if (count == 0) {
                    console.log('Success: ' + JSON.stringify(result));
                    res.send({'status': 'success', 'message': "Data Uploaded Successfully"});
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
        collection.find().sort({'createdDate': -1}).toArray(function (err, items) {

            if (err) {
                res.send({'error': 'An error has occurred'})
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
        collection.insert(array, {safe: true}, function (err, result) {
            if (err) {
                /*res.send({
                 'status': 'error',
                 'message': 'An error has occurred'
                 });*/
                res.send(err);
            } else {
                if (count == 0) {
                    console.log('Success: ' + JSON.stringify(result));
                    res.send({'status': 'success', 'message': "Data Uploaded Successfully"});
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
        collection.find().sort({'createdDate': -1}).toArray(function (err, items) {

            if (err) {
                res.send({'error': 'An error has occurred'})
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
        collection.insert(array, {safe: true}, function (err, result) {
            if (err) {
                /*res.send({
                 'status': 'error',
                 'message': 'An error has occurred'
                 });*/
                res.send(err);
            } else {
                if (count == 0) {
                    console.log('Success: ' + JSON.stringify(result));
                    res.send({'status': 'success', 'message': "Data Uploaded Successfully"});
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
        collection.find().sort({'createdDate': -1}).toArray(function (err, items) {

            if (err) {
                res.send({'error': 'An error has occurred'})
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
        collection.find().limit(20).sort({'createdDate': -1}).toArray(function (err, items) {

            if (err) {
                res.send({'error': 'An error has occurred'})
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
        collection.find().sort({'createdDate': -1}).toArray(function (err, items) {

            if (err) {
                res.send({'error': 'An error has occurred'})
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
        collection.find().toArray(function (err, result) {

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
exports.addPartners = function (req, res) {
    var info = req.body;
    info.createdDate = new Date().getTime().toString();
    info.updatedDate = new Date().getTime().toString();

    db.collection('partners', function (err, collection) {
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
exports.editPartners = function (req, res) {
    var info = req.body;
    var id = req.body.objectId;
    info.updatedDate = new Date().getTime().toString();

    delete info.objectId;
    db.collection('partners', function (err, collection) {
        collection.update({'_id': new ObjectID(id)}, info, {safe: true}, function (err, result) {
            if (err) {
                res.send({'status': 'error', 'message': 'An error has occurred'});
            }
            else {
                console.log(result);
                res.send({'status': 'success', 'message': 'Data Updated successfully'});
            }
        });
    });
}
//service to get partner details
exports.getPartnerDetails = function (req, res) {
    db.collection('partners', function (err, collection) {
        console.log(req.body.objectId);
        collection.findOne({'_id': new ObjectID(req.body.objectId)}, function (err, result) {
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
//Service to add Blog
exports.addBlog = function (req, res) {
    var info = req.body;
    info.createdDate = new Date().getTime().toString();
    info.updatedDate = new Date().getTime().toString();

    db.collection('blog', function (err, collection) {
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

exports.editBlog = function (req, res) {
    var info = req.body;
    var id = req.body.objectId;
    info.updatedDate = new Date().getTime().toString();

    delete info.objectId;
    db.collection('blog', function (err, collection) {
        collection.update({'_id': new ObjectID(id)}, info, {safe: true}, function (err, result) {
            if (err) {
                res.send({'status': 'error', 'message': 'An error has occurred'});
            }
            else {
                console.log(result);
                res.send({'status': 'success', 'message': 'Data Updated successfully'});
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
        collection.findOne({'_id': new ObjectID(req.body.objectId)}, function (err, result) {
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


exports.getNewsList = function (req, res) {
    db.collection('uaNews', function (err, collection) {
        collection.find(req.body).sort({'newsdate': -1}).toArray(function (err, result) {

            if (err) {
                res.send({'status': 'error', 'message': 'An error has occurred'});
            }
            if (result == null) {
                res.send({'status': 'error', 'message': 'Data Not Found'});
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

exports.editNews = function (req, res) {
    var info = req.body;
    var id = req.body.objectId;
    info.updatedDate = new Date().getTime().toString();

    delete info.objectId;
    db.collection('uaNews', function (err, collection) {
        collection.update({'_id': new ObjectID(id)}, info, {safe: true}, function (err, result) {
            if (err) {
                res.send({'status': 'error', 'message': 'An error has occurred'});
            }
            else {
                console.log(result);
                res.send({'status': 'success', 'message': 'Data Updated successfully'});
            }
        });
    });
}
exports.getNewsDetails = function (req, res) {
    db.collection('uaNews', function (err, collection) {
        console.log(req.body.objectId);
        collection.findOne({'_id': new ObjectID(req.body.objectId)}, function (err, result) {
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


exports.addAuthor = function (req, res) {
    var info = req.body;
    info.createdDate = new Date().getTime().toString();
    info.updatedDate = new Date().getTime().toString();

    db.collection('author', function (err, collection) {
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

//Service to edit people
exports.editAuthor = function (req, res) {
    var info = req.body;
    var id = req.body.objectId;
    info.updatedDate = new Date().getTime().toString();

    delete info.objectId;
    db.collection('author', function (err, collection) {
        collection.update({'_id': new ObjectID(id)}, info, {safe: true}, function (err, result) {
            if (err) {
                res.send({'status': 'error', 'message': 'An error has occurred'});
            }
            else {
                console.log(result);
                res.send({'status': 'success', 'message': 'Data Updated successfully'});
            }
        });
    });
}
//service to get people details
exports.getAuthorDetails = function (req, res) {
    db.collection('author', function (err, collection) {
        console.log(req.body.objectId);
        collection.findOne({'_id': new ObjectID(req.body.objectId)}, function (err, result) {
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
        to: 'mneville@utility-aid.co.uk,GilesHankinson@utility-aid.co.uk,njones@utility-aid.co.uk',
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
        to: 'GilesHankinson@utility-aid.co.uk,chetan@scriptlanes.com,njones@utility-aid.co.uk,mneville@utility-aid.co.uk',
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
        to: 'GilesHankinson@utility-aid.co.uk,chetan@scriptlanes.com,njones@utility-aid.co.uk,mneville@utility-aid.co.uk',
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
exports.getCaseStudiesDetails = function (req, res) {
    db.collection('caseStudies', function (err, collection) {
        console.log(req.body.objectId);
        collection.findOne({'_id': new ObjectID(req.body.objectId)}, function (err, result) {
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

exports.addCaseStudies = function (req, res) {
    var info = req.body;
    info.createdDate = new Date().getTime().toString();
    info.updatedDate = new Date().getTime().toString();

    db.collection('caseStudies', function (err, collection) {
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

exports.editCaseStudies = function (req, res) {
    var info = req.body;
    var id = req.body.objectId;
    info.updatedDate = new Date().getTime().toString();

    delete info.objectId;
    db.collection('caseStudies', function (err, collection) {
        collection.update({'_id': new ObjectID(id)}, info, {safe: true}, function (err, result) {
            if (err) {
                res.send({'status': 'error', 'message': 'An error has occurred'});
            }
            else {
                console.log(result);
                res.send({'status': 'success', 'message': 'Data Updated successfully'});
            }
        });
    });
}

exports.getProductList = function (req, res) {
    var collection = req.body.collection;
    db.collection(collection, function (err, collection) {
        collection.find({}).toArray(function (err, result) {
            if (err) {
                res.send({'status': 'error', 'message': 'An error has occurred'});
            }
            if (result == null) {
                res.send({'status': 'error', 'message': 'Data Not Found'});
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
exports.updateProductData = function (req, res) {
    var info = req.body;
    var id = req.body.objectId;
    console.log(id);
    var collection = req.body.collection;
    info.updatedDate = new Date().getTime().toString();

    delete info.objectId;
    db.collection(collection, function (err, collection) {
        collection.update({'_id': new ObjectID(id)}, info, {safe: true}, function (err, result) {
            if (err) {
                res.send({'status': 'error', 'message': 'An error has occurred'});
            }
            else {
                console.log(result);
                res.send({'status': 'success', 'message': 'Data Updated successfully'});
            }
        });
    });
}


exports.getContactData = function (req, res) {
    db.collection('contact', function (err, collection) {
        console.log(req.body.objectId);
        collection.findOne({'_id': new ObjectID(req.body.objectId)}, function (err, result) {
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

exports.getProductDetails = function (req, res) {
    db.collection('products', function (err, collection) {
        console.log(req.body.objectId);
        collection.findOne({'_id': new ObjectID(req.body.objectId)}, function (err, result) {
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
        collection.update({'_id': new ObjectID(id)}, info, {safe: true}, function (err, result) {
            if (err) {
                res.send({'status': 'error', 'message': 'An error has occurred'});
            }
            else {
                console.log(result);
                res.send({'status': 'success', 'message': 'Data Updated successfully'});
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
                res.send({'status': 'error', 'message': 'An error has occurred'});
            }
            if (result == null) {
                res.send({'status': 'error', 'message': 'Data Not Found'});
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
        collection.insert(info, {safe: true}, function (err, result) {
            if (err) {
                res.send({'status': 'error', 'message': 'An error has occurred'});
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
        collection.find({'_id': new ObjectID(id)}).toArray(function (err, result) {
            if (err) {
                res.send({'status': 'error', 'message': 'An error has occurred'});
            }
            if (result == null) {
                res.send({'status': 'error', 'message': 'Data Not Found'});
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
        collection.remove({'_id': new ObjectID(id)})(function (err) {
            res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});

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

/*=================================================
 * ua-energy API calls ends here
 * =================================================*/