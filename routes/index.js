var express = require('express');
var router = express.Router();
const mongodb = require("mongodb");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017/";

let db;
MongoClient.connect(url, { useNewUrlParser: true },
    function (err, client) {
      if (err) {
        console.log("Err  ", err);
      } else {
        console.log("Connected successfully to server");
        db = client.db("Database");
      }
    });

router.get('/', function(req, res) {
  res.render('index.html');
});


router.get('/newTask', function (req,res) {
    res.render('newTask.html');
});


router.get('/listTasks', function(req, res){
     db.collection('users').find({}).toArray(function (err, d) {
         res.render("listTasks", {tasks: d});
});
});

router.get("/updateTask", function(req, res){
    res.render('updateTask.html');
});



router.post('/addtask', function(req, res){
    let details = req.body;
    db.collection('users').insertOne({
        Id: details._id,
        name :details.name,
        due: details.due,
        status: details.status,
        desc: details.desc,
        Assign:details.assigns,
    });
    res.redirect('/listTasks');
});

router.post('/updateCurrent', function (req,res) {
    let id = require('mongodb').ObjectID(req.body.taskid);
    let filter = {_id : id};
    let update = {$set : {status : req.body.status}};
    db.collection("users").updateOne(filter, update);
    res.redirect('/listTasks');
});

router.post('/removetask', function (req, res) {
    let id = require('mongodb').ObjectID(req.body.taskid);
    db.collection('users').deleteOne({_id : id});
    res.redirect('/listTasks');
});


router.post('/removeAll',function (req,res) {
    db.collection('users').deleteMany({});
    res.redirect('/listTasks');
});


router.get("/removeTask", function(req, res){
    res.render('removeTask.html');
});
router.get("/removeOld", function(req, res){
    res.render('deleteOldComplete.html');
});


router.post("/removeallOldTask", function (req,res) {
    let today = new Date();
    let dates = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    // let sta = { };
    // let date = {};
    db.collection('users').find({"$or": [{status: { $eq: "complete" }}, {due: {$lt: dates}}]}).toArray(function (err, result) {
            result.forEach(function (query) {
                let id = require('mongodb').ObjectID(query._id);
                db.collection('users').deleteOne({_id : id});
            });
    });
    res.redirect('/listTasks');

});

    module.exports = router;

