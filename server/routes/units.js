'use strict';

var express = require('express');
var router = express.Router();
var units = require('../units.json');
var unitUtils = require('../utils/unit-utils');

/**
 * @api {get} /units Request all supported units
 * @apiDescription Returns all supported unit classes, quantities and their corresponding units.
 * @apiExample Example usage:
 *      https://kung-funit.appspot.com/units
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
 * @apiSuccess {String} data.classes.quantities.units.symbol The symbol of the unit, which is used for the conversion.
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
 * @api {get} /units/convert Convert a list of units
 * @apiDescription Returns the conversions for the provided values of a unit.
 * @apiExample Example usage:
 *      https://kung-funit.appspot.com/units/convert?q=1&source=km&target=m
 *      https://kung-funit.appspot.com/units/convert?q=1&q=2&source=kg&target=g
 *      https://kung-funit.appspot.com/units/convert?q=1&source=USD&target=EUR&date=2014-07-13
 *      https://kung-funit.appspot.com/units/convert?q=1&q=2&source=EUR&target=GBP&date=2016-06-23
 * @apiName GetConversion
 * @apiGroup Units
 *
 * @apiParam {Number} q The value(s) that should be converted.
 * @apiParam {String} source The symbolic representation of the unit to convert from.
 * @apiParam {String} target The symbolic representation of the unit to convert to.
 * @apiParam {String} date The optional date of the conversion rate that should be used.
 *
 * @apiSuccess {Object} data Wrapping data container for the result.
 * @apiSuccess {Object[]} data.conversions A list containing all of the conversion results in the order requested.
 * @apiSuccess {Object} data.conversions[i] A specific conversion.
 * @apiSuccess {Number} data.conversions.convertedUnit The numeric result of the conversion.
 * @apiSuccessExample {json} Response (example):
 * {
 *   "data": {
 *     "conversions": [
 *       {
 *         "convertedUnit": 1000
 *       },
 *       {
 *         "convertedUnit": 2000
 *       }, ...
 *     ]
 *   }
 * }
 */
router.get('/convert', function (req, res) {
    var values = Array.isArray(req.query.q) ? req.query.q : [req.query.q];
    var source = req.query.source;
    var target = req.query.target;
    var date = req.query.date;
    var conversions = [];

    if (date) {
        conversions = unitUtils.convertCurrency(values, source, target, date);
    } else {
        conversions = unitUtils.convertUnit(values, source, target);
    }

    var response = {
        "data": {
            "conversions": conversions
        }
    };

    res.json(response);
});

/**
 * Update the currency rates. This route is called in regular intervals by a corresponding cron job.
 * The route itself is meant for internal use only and is therefore not publicly documented.
 */
router.get('/currencies/update', function (req, res) {
    unitUtils.updateCurrencyRates();
    res.sendStatus(200);
});

module.exports = router;
