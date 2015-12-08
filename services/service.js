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
//var lwip = require('lwip');

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


//Test Service
exports.uploadData = function (req, res) {
    console.log(req.files);

//res.json(req.files);
    var name = req.files.originalname;
    var fileType = req.files.mimetype;
    var newPath = "utilityAid/tmp/" + req.files.originalname;

    var payload =
    {
        'path': newPath,
        'fileType': fileType,
        'fileName': name
    }
    res.json(payload);
}

exports.uploadImage = function (req, res) {
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
        var dstPath = './public/utilityAid/images/thumbnails/' + req.files[i].filename;
        var thumbDir = 'utilityAid/images/thumbnails/' + req.files[i].filename;

        im.resize({
            srcPath: np,
            dstPath: dstPath,
            width: 280,
            height: 200
        }, function (err) {
            if (err) {
                res.send(err);
            }
            else { //console.log('resized kittens.jpg to fit within 256x256px');
            }
        });


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
            thumbPath: thumbDir,
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


        /*lwip.open(tmp, function(err, image) {
         var nc =i;
         if (err) {
         console.log(err);
         }
         else
         {
         image.resize(280, 200, function(err, rzdImg) {
         rzdImg.writeFile(dstPath, function(err) {
         if (err) {
         console.log(err);
         }
         else
         {
         console.log("Thumbnail created");
         }
         });
         });
         }
         });*/


        var imagePath = {};


        fs.rename('./public/utilityAid/tmp/' + req.files[i].filename, np, function (success) {


            Jimp.read(np, function (err, lenna) {
                if (err) throw err;
                lenna.resize(280, 200)            // resize
                    .write(dstPath); // save
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

//Service to get background images
exports.getBackgroundImages = function (req, res) {
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


//Service to add homepage text
exports.homepageText = function (req, res) {
    var info = req.body;
    var id = req.body.objectId;


    delete info.objectId;
    db.collection('homepageText', function (err, collection) {
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

//Service to get homepage data
exports.getHomepageText = function (req, res) {
    db.collection('homepageText', function (err, collection) {
        collection.find({}).toArray(function (err, result) {
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
}