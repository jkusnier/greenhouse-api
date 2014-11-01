var express = require('express');
var router = express.Router();

router.use(function(req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

router.get('/devices/:device_id/environment', function (req, res) {
    var db = req.db;
    db.collection('environment').findOne({coreid: req.params.device_id}, {sort: {created_on: -1}}, function (err, result) {
        res.json(result);
    });
});

router.get('/devices', function (req, res) {
    var db = req.db;
    db.collection('devices').find().toArray(function (err, items) {
        res.json(items);
    });
});

//router.get('/humidity', function (req, res) {
//    var db = req.db;
//
//});

// Not yet
//router.post('/data', function (req, res) {
//    res.status(200).send("OK");
//});

module.exports = router;
