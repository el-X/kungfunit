'use strict';

var express = require('express');
var router = express.Router();
var Qty = require('js-quantities');
var math = require('mathjs');

/**
 * GET all available quantities and their corresponding units.
 **/
router.get('/', function (req, res) {
    var quantities = {
        "quantities": [
            {
                "quantity": {
                    "name": "Length",
                    "units": [
                        {
                            "unit": {
                                "name": "Kilometre",
                                "symbol": "km"
                            }
                        },
                        {
                            "unit": {
                                "name": "Metre",
                                "symbol": "m"
                            }
                        },
                        {
                            "unit": {
                                "name": "Centimetre",
                                "symbol": "cm"
                            }
                        },
                        {
                            "unit": {
                                "name": "Millimetre",
                                "symbol": "mm"
                            }
                        },
                        {
                            "unit": {
                                "name": "Micrometre",
                                "symbol": "um"
                            }
                        },
                        {
                            "unit": {
                                "name": "Nanometre",
                                "symbol": "nm"
                            }
                        },
                        {
                            "unit": {
                                "name": "Mile",
                                "symbol": "mi"
                            }
                        },
                        {
                            "unit": {
                                "name": "Yard",
                                "symbol": "yd"
                            }
                        },
                        {
                            "unit": {
                                "name": "Foot",
                                "symbol": "ft"
                            }
                        },
                        {
                            "unit": {
                                "name": "Inch",
                                "symbol": "in"
                            }
                        }
                    ]
                }
            }
        ]
    };

    var response = {"data": quantities};
    res.json(response);
});

/**
 * GET the conversion for a certain unit.
 **/
router.get('/convert', function (req, res) {
    var query = req.query.q;
    var source = req.query.source;
    var target = req.query.target;

    var from = math.unit(query, source);
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
