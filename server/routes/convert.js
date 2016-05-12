var express = require('express');
var router = express.Router();

/* GET the conversion for a certain unit. */
router.get('/', function(req, res, next) {
  res.send('The conversions will occur right here');
});

module.exports = router;
