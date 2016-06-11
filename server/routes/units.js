'use strict';

var express = require('express');
var router = express.Router();
var Qty = require('js-quantities');
var math = require('mathjs');
var units = require('../units.json');

/**
 * GET all supported unit classes, quantities and their corresponding units.
 **/
router.get('/', function (req, res) {
    var response = {"data": units};
    res.json(response);
});

/**
 * GET the conversion for a certain unit.
 **/
router.get('/convert', function (req, res) {
    var value = req.query.q;
    var source = req.query.source;
    var target = req.query.target;

    var from = math.unit(value, source);
    var to = from.toNumber(target);

    var response = {
        "data": {
            "conversions": [
                {"convertedUnit": to}
            ]
        }
    };

    res.json(response);
});

module.exports = router;
