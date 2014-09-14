var express = require('express');
var router = express.Router();

router.get('/temperature', function(req, res) {
  var db = req.db;

});

router.get('/humidity', function(req, res) {
  var db = req.db;

});

router.post('/data', function(req, res) {
//	console.log(req);
//	console.log(res);

	res.status(200).send("OK");
});

module.exports = router;
