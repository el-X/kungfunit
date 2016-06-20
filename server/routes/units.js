'use strict';

var express = require('express');
var router = express.Router();
var lodash = require('lodash');
var fx = require('money');
var math = require('mathjs');
var units = require('../units.json');
var rates = require('../rates.json');

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
