'use strict';

var express = require('express');
var router = express.Router();
var Qty = require('js-quantities');
var math = require('mathjs');

/**
 * GET all available quantities and their corresponding units.
 **/
router.get('/', function (req, res) {
    var response = {"data": getQuantities()};
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

function getQuantities() {
    return {
        "quantities": [
            {

                "name": "Length",
                "units": [
                    {
                        "name": "Kilometre",
                        "symbol": "km"
                    },
                    {
                        "name": "Metre",
                        "symbol": "m"
                    },
                    {
                        "name": "Centimetre",
                        "symbol": "cm"
                    },
                    {
                        "name": "Millimetre",
                        "symbol": "mm"
                    },
                    {
                        "name": "Micrometre",
                        "symbol": "um"
                    },
                    {
                        "name": "Nanometre",
                        "symbol": "nm"
                    },
                    {
                        "name": "Mile",
                        "symbol": "mi"
                    },
                    {
                        "name": "Yard",
                        "symbol": "yd"
                    },
                    {
                        "name": "Foot",
                        "symbol": "ft"
                    },
                    {
                        "name": "Inch",
                        "symbol": "in"
                    }
                ]
            },

            {
                "name": "Mass",
                "units": [
                    {
                        "name": "Tonne",
                        "symbol": "tonne"
                    },
                    {
                        "name": "Kilogram",
                        "symbol": "kg"
                    },
                    {
                        "name": "Gram",
                        "symbol": "g"
                    },
                    {
                        "name": "Milligram",
                        "symbol": "mg"
                    },
                    {
                        "name": "Microgram",
                        "symbol": "ug"
                    },
                    {
                        "name": "US ton",
                        "symbol": "ton"
                    },
                    {
                        "name": "Stone",
                        "symbol": "stone"
                    },
                    {
                        "name": "Pound",
                        "symbol": "lb"
                    },
                    {
                        "name": "Ounce",
                        "symbol": "oz"
                    }
                ]
            },
            {
                "name": "Time",
                "units": [
                    {
                        "name": "Nanosecond",
                        "symbol": "ns"
                    },
                    {
                        "name": "Microsecond",
                        "symbol": "us"
                    },
                    {
                        "name": "Millisecond",
                        "symbol": "ms"
                    },
                    {
                        "name": "Second",
                        "symbol": "s"
                    },
                    {
                        "name": "Minutes",
                        "symbol": "mins"
                    },
                    {
                        "name": "Hour",
                        "symbol": "h"
                    },
                    {
                        "name": "Day",
                        "symbol": "days"
                    },
                    {
                        "name": "Week",
                        "symbol": "weeks"
                    },
                    {
                        "name": "Month",
                        "symbol": "months"
                    },
                    {
                        "name": "Year",
                        "symbol": "years"
                    },
                    {
                        "name": "Decade",
                        "symbol": "decades"
                    },
                    {
                        "name": "Century",
                        "symbol": "centuries"
                    },
                    {
                        "name": "Millennium",
                        "symbol": "millennia"
                    }
                ]
            },
            {
                "name": "Temperature",
                "units": [
                    {
                        "name": "Celsius",
                        "symbol": "degC"
                    },
                    {
                        "name": "Fahrenheit",
                        "symbol": "degF"
                    },
                    {
                        "name": "Kelvin",
                        "symbol": "K"
                    },
                    {
                        "name": "Rankine",
                        "symbol": "degR"
                    }
                ]
            }
        ]
    };
}

module.exports = router;
