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
                    //req.session.user = data;
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
                lenna.resize(360, 200)
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

//Service to add Casestudies
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

exports.getCaseStudiesList = function (req, res) {
    db.collection('caseStudies', function (err, collection) {
        collection.find({}).sort({'createdDate': -1}).toArray(function (err, result) {
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

//service to get case study details
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

//service to get case study last one
exports.getCaseStudiesLastOne = function (req, res) {
    db.collection('caseStudies', function (err, collection) {
        collection.find({}).sort({'createdDate': -1}).toArray(function (err, result) {
            if (err) {
                res.send({'status': 'error', 'message': 'An error has occurred'});
            }
            if (result == null) {
                res.send({'status': 'error', 'message': 'Data Not Found'});
            }
            if (result !== null) {
                var data = result[0];
                res.send(data);
            }
        });
    })
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

//Service to upload Author images
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


//Service to add Partners
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

exports.getPartnersList = function (req, res) {
    db.collection('partners', function (err, collection) {
        collection.find({}).sort({'createdDate': -1}).toArray(function (err, result) {
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


//Service to add people
exports.addPeople = function (req, res) {
    var info = req.body;
    info.createdDate = new Date().getTime().toString();
    info.updatedDate = new Date().getTime().toString();

    db.collection('people', function (err, collection) {
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
//Service to people List
exports.getPeopleList = function (req, res) {
    db.collection('people', function (err, collection) {
        collection.find({}).sort({'people_order_1': 1}).toArray(function (err, result) {

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

//Service to edit people
exports.editPeople = function (req, res) {
    var info = req.body;
    var id = req.body.objectId;
    info.updatedDate = new Date().getTime().toString();

    delete info.objectId;
    db.collection('people', function (err, collection) {
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
exports.getPeopleDetails = function (req, res) {
    db.collection('people', function (err, collection) {
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


//Service to add author
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
//Service to people List
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


//Service to default List
exports.getDefaultList = function (req, res) {
    db.collection('default', function (err, collection) {
        collection.find({}).sort({'_id': 1}).toArray(function (err, result) {

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

//Service to edit default
exports.editDefault = function (req, res) {
    var info = req.body;
    var id = req.body.objectId;
    info.updatedDate = new Date().getTime().toString();

    delete info.objectId;
    db.collection('default', function (err, collection) {
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
//service to get default details
exports.getDefaultDetails = function (req, res) {
    db.collection('default', function (err, collection) {
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

//Service to add Default
exports.addDefault = function (req, res) {
    var info = req.body;
    info.createdDate = new Date().getTime().toString();
    info.updatedDate = new Date().getTime().toString();

    db.collection('default', function (err, collection) {
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


//Service to edit about
exports.editAbout = function (req, res) {
    var info = req.body;
    var id = req.body.objectId;
    info.updatedDate = new Date().getTime().toString();

    delete info.objectId;
    db.collection('about', function (err, collection) {
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
//Service to get about text

//Service to get homepage data
exports.getAboutDetails = function (req, res) {
    db.collection('about', function (err, collection) {
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
        collection.find({}).sort({'createdDate': -1}).toArray(function (err, result) {
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

//service to get blogdetails
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

//service to get article details
exports.getArticleDetails = function (req, res) {
    console.log(req.body.slug);
    db.collection('blog', function (err, collection) {
        collection.findOne({'slug': req.body.slug}, function (err, result) {
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





