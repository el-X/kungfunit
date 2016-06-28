'use strict';

var express = require('express');
var router = express.Router();
var lodash = require('lodash');
var fx = require('money');
var math = require('mathjs');
var units = require('../units.json');
var rates = require('../rates.json');

/**
 * @api {get} /units Request all supported units
 * @apiDescription Returns all supported unit classes, quantities and their corresponding units.
 * @apiExample Example usage:
 *      https://kungfunit.appspot.com/units
 * @apiName GetUnits
 * @apiGroup Units
 *
 * @apiSuccess {Object} data Wrapping data container for the result.
 * @apiSuccess {Object[]} data.classes A list containing all of the supported unit classes.
 * @apiSuccess {Object} data.classes[i] A specific unit class.
 * @apiSuccess {String} data.classes.name The name of the unit class.
 * @apiSuccess {Object[]} data.classes.quantities All unit quantities that are subordinated to the class.
 * @apiSuccess {Object} data.classes.quantities[i] A specific quantity.
 * @apiSuccess {String} data.classes.quantities.name The name of the quantity.
 * @apiSuccess {Object[]} data.classes.quantities.units All units that are subordinated to the quantity.
 * @apiSuccess {Object} data.classes.quantities.units[i] A specific unit.
 * @apiSuccess {String} data.classes.quantities.units.name The name of the unit.
 * @apiSuccess {String} data.classes.quantities.units.symbol The symbol of the unit which is used for the conversion.
 * @apiSuccessExample {json} Response (example):
 * {
 *   "data": {
 *     "classes": [
 *       {
 *         "name": "SI base units",
 *         "quantities": [
 *           {
 *             "name": "Length",
 *             "units": [
 *               {
 *                 "name": "Kilometre",
 *                 "symbol": "km"
 *               },
 *               {
 *                 "name": "Metre",
 *                 "symbol": "m"
 *               },
 *               {
 *                 "name": "Centimetre",
 *                 "symbol": "cm"
 *               }, ...
 *             ]
 *           }, ...
 *         ]
 *       }, ...
 *     ]
 *   }
 * }
 */
router.get('/', function (req, res) {
    var response = {"data": units};
    res.json(response);
});

/**
 * @api {get} /units/convert Convert a specific unit
 * @apiDescription Returns the conversion for a certain unit.
 * @apiExample Example usage:
 *      https://kungfunit.appspot.com/units/convert?q=1&source=km&target=m
 *      https://kungfunit.appspot.com/units/convert?q=1&source=USD&target=EUR&date=2016-06-22
 * @apiName GetConversion
 * @apiGroup Units
 *
 * @apiParam {Number} q The value that should be converted
 * @apiParam {String} source The symbolic representation of the source values unit
 * @apiParam {String} target The symbolic representation of the unit to converted to
 * @apiParam {String} date The date of the conversion rate that should be used.
 *
 * @apiSuccess {Object} data Wrapping data container for the result.
 * @apiSuccess {Object[]} data.conversions A list containing all of the conversion results.
 * @apiSuccess {Object} data.conversions[i] A specific conversion.
 * @apiSuccess {Object} data.conversions.convertedUnit The numeric result of the conversion.
 * @apiSuccessExample {json} Response (example):
 * {
 *   "data": {
 *     "conversions": [
 *       {
 *         "convertedUnit": 1000
 *       }
 *     ]
 *   }
 * }
 */
router.get('/convert', function (req, res) {
    var value = req.query.q;
    var source = req.query.source;
    var target = req.query.target;
    var date = req.query.date;
    var result;

    if (date) {
        result = convertCurrency(value, source, target, date);
    } else {
        result = convertUnit(value, source, target);
    }

    var response = {
        "data": {
            "conversions": [
                {"convertedUnit": result}
            ]
        }
    };

    res.json(response);
});

/**
 * Update the currency rates.
 **/
router.get('/currencies/update', function (req, res) {
    updateCurrencyRates();
    res.sendStatus(200);
});

function convertUnit(value, source, target) {
    var from = math.unit(value, source);
    return from.toNumber(target);
}

function convertCurrency(value, source, target, date) {
    var baseCurrency = "USD";

    fx.base = baseCurrency;
    fx.rates = rates[date];

    var conversion = fx(value).from(source).to(target);

    return math.round(conversion, 2);
}

function updateCurrencyRates() {
    var apiKey = "02ca72e641eb4a749705109b760f7ff1";
    var currencyUrl = "https://openexchangerates.org/api/latest.json?app_id=" + apiKey;
    var supportedCurrencies = ["USD", "EUR", "JPY", "GBP", "AUD"];

    var newRates = {
        disclaimer: "https://openexchangerates.org/terms/",
        license: "https://openexchangerates.org/license/",
        timestamp: 1449877801,
        base: "USD",
        rates: {
            "AED": 3.67279,
            "AFN": 69.32,
            "ALL": 121.803501,
            "AMD": 477.0125,
            "ANG": 1.788725,
            "AOA": 165.782831,
            "ARS": 13.89865,
            "AUD": 1.390866,
            "EUR": 0.885093,
            "JPY": 104.5879,
            "GBP": 0.691204,
            "USD": 1
        }
    }

    var oldDate = "2016-06-19";
    var newDate = "2016-06-24";

    newRates = lodash.pick(newRates.rates, supportedCurrencies);

    delete rates[oldDate];
    rates[newDate] = newRates;
}

module.exports = router;
