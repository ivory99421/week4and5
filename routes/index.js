var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
//const mongodb = require("mongodb");
//const MongoClient = mongodb.MongoClient;

//let db;


const Tasks = require('../models/tasks.js');
const Developers = require('../models/developer.js');

mongoose.connect('mongodb://localhost:27017/libDB', function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }
    console.log('Successfully connected');
});


router.get("/removeTask", function(req, res){
    res.render('removeTask.html');
});

router.get("/removeOld", function(req, res){
    res.render('deleteOldComplete.html');
});

router.get("/newDevelop", function(req, res){
    res.render('newDeveloper.html');
});

router.get('/', function(req, res) {
  res.render('index.html');
});

router.get('/newTask', function (req,res) {
    Developers.find({}, function (err, d) {
        res.render('newTask.html', {developers: d});
    });
});

router.get('/listTasks', function(req, res){
    Tasks.find({}, function (err, d) {
        res.render("listTasks.html", {tasks: d});
    });
});

router.get("/updateTask", function(req, res){
    res.render('updateTask.html');
});

router.get('/listDeveloper', function (req, res) {
    Developers.find({}, function (err, d) {
        res.render("listDevelopers.html", {developers: d});
    });
});






router.post('/addtask', function(req, res) {
    let task = new Tasks({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        due: req.body.due,
        desc: req.body.desc,
        developer: req.body.assigns,
        status: req.body.status
    });
    task.save(function (err) {
        if (err) throw err;
        console.log('Successful');
    });
    res.redirect('/listTasks');
});

router.post('/updateCurrent', function (req,res) {
    let id = new mongoose.Types.ObjectId(req.body.taskid);
    let filter = {_id : id};
    let update = {$set : {status : req.body.status}};
    Tasks.updateOne(filter, update, function (err) {
        if (err){
            console.log("update error");
        };
    });
    res.redirect('/listTasks');
});

router.post('/removetask', function (req, res) {
    let id = new mongoose.Types.ObjectId(req.body.taskid);
    Tasks.deleteOne({_id : id}, function (err) {
        console.log("delete error");
    });
    res.redirect('/listTasks');
});


router.post('/removeAll',function (req,res) {
    Tasks.deleteMany({} , function (err) {
        console.log("delete error");
    });
    res.redirect('/listTasks');
});




router.post("/addDeveloper", function (req,res) {
    let developer = new Developers({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: req.body.name,
            surname: req.body.surname
        },
        level: req.body.level,
        address: {
            state: req.body.state,
            suburb: req.body.suburb,
            street: req.body.street,
            unit: req.body.unit
        }
    });
    var newDevelop = new Developers(developer);
    newDevelop.save(function (err) {
        if (err) throw err;
        console.log("Developer add");
    });
    res.redirect('/listDeveloper');
});

router.post("/removeallOldTask", function (req,res) {
    let today = new Date();
    let dates = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let a = Tasks.find({"$or": [{status: { $eq: "complete" }}, {due: {$lt: dates}}]}).toArray(function (err, result) {
            result.forEach(function (query) {
                let id = require('mongodb').ObjectID(query._id);
                Tasks.deleteOne({_id : id});
            });
    });
    res.redirect('/listTasks');

});

router.get('/updateNmame/:oldname/:newname', function (req,res) {
    let oldname = req.params.oldname;
    let newname = req.params.newname;
    Developers.updateMany({ 'name.firstName': oldname }, { $set: { 'name.firstName': newname} }, function (err, doc) {
        console.log("successful");
    });
    res.redirect('/listDeveloper');
});
    module.exports = router;

