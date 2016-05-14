'use strict';

var express = require('express');
var router = express.Router();
var Qty = require('js-quantities');
var math = require('mathjs');

/* GET the conversion for a certain unit. */
router.get('/convert', function (req, res) {
    var quantity = req.query.q;
    var source = req.query.source;
    var target = req.query.target;

    var from = math.unit(quantity, source);
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
