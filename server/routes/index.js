'use strict';

var express = require('express');
var router = express.Router();

/**
 * By default express looks inside the public-folder for an appropriate index.html file.
 * In case this file is not present, an error is thrown.
 **/
router.get('/', function (req, res) {
    res.status(404);
    res.send('Error - No index.html found')
});

module.exports = router;
