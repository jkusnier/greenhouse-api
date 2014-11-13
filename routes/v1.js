var express = require('express');
var router = express.Router();
var moment = require('moment');

router.use(function (req, res, next) {
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

router.get('/devices/:device_id/data/fahrenheit', function (req, res) {
    var db = req.db;
    db.collection('data_fahrenheit').find({coreid: req.params.device_id}, {sort: {time: 1}}).toArray(function (err, items) {
        res.json(items);
    });
});

router.get('/devices/:device_id/hist/fahrenheit', function (req, res) {
    var db = req.db;
    var startDate = moment().subtract(14, 'days').startOf('day');
    db.collection('hist_fahrenheit').find({
        coreid: req.params.device_id,
        time: {$gte: new Date(startDate)}
    }, {sort: {time: 1}}).toArray(function (err, items) {
        res.json(items);
    });
})

router.get('/devices/:device_id/hist/fahrenheit/all', function (req, res) {
    var db = req.db;
    db.collection('hist_fahrenheit').find({coreid: req.params.device_id}, {sort: {time: 1}}).toArray(function (err, items) {
        res.json(items);
    });
});

router.get('/weather/:station_id/fahrenheit', function (req, res) {
    var db = req.db;
    var startDate = moment().subtract(14, 'days').startOf('day');
    db.collection('wunderground_aggregate').find({
        station_id: req.params.station_id,
        time: {$gte: new Date(startDate)}
    }, {sort: {time: 1}}).toArray(function (err, items) {
        res.json(items);
    });
});

router.get('/weather/:station_id/fahrenheit/now', function (req, res) {
    var db = req.db;
    var startDate = moment().subtract(14, 'days').startOf('day');
    db.collection('wunderground_aggregate').findOne({
        station_id: req.params.station_id,
        time: {$gte: new Date(startDate)}
    }, {sort: {time: -1}}, function (err, items) {
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
