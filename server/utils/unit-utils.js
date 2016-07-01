'use strict';

const CURRENCY_RATE_TIME_SPAN = 5;
const DATE_FORMAT = "YYYY-MM-DD";
const DATASTORE_KIND = "Rates";

var async = require('async');
var config = require('../config');
var fx = require('money');
var math = require('mathjs');
var moment = require('moment');
var request = require('request');

var gcloud = require('gcloud');

process.env.GCLOUD_PROJECT = process.env.GCLOUD_PROJECT ? process.env.GCLOUD_PROJECT : config['GCLOUD_PROJECT'];
var datastore = gcloud.datastore({
    projectId: process.env.GCLOUD_PROJECT
});

var unitUtils = {};
var rates = {};

fx.base = "EUR";    // the base currency

/**
 * Converts a certain value from a source to a specific target unit.
 * Only units other than currencies are allowed.
 *
 * @param value the value to be converted
 * @param source the values source unit
 * @param target the values target unit
 * @returns {number} the value for the desired target unit
 */
unitUtils.convertUnit = function (value, source, target) {
    var from = math.unit(value, source);

    return from.toNumber(target);
}

/**
 * Converts a certain currency value from a source to a specific target currency.
 * Only currencies are supported.
 *
 * @param value the currency value to be converted
 * @param source the values source currency
 * @param target the values target currency
 * @param date the date indication for the currency rate
 * @returns {number} the currency value for the desired target currency
 */
unitUtils.convertCurrency = function (value, source, target, date) {
    fx.rates = rates[date];
    var conversion = fx(value).from(source).to(target);

    return math.round(conversion, 2);
}

/**
 * Initializes the currency rates on startup for the given currency rate time span.
 */
unitUtils.initCurrencyRates = function () {
    var count = 0;

    async.whilst(
        function () {
            return count < CURRENCY_RATE_TIME_SPAN;
        },
        function (loopCallback) {
            initCurrencyRates(count, loopCallback);
            count++;
        },
        function (err) {        // called when the initialization finished
            deleteIrrelevantRates();
        }
    );
}

function initCurrencyRates(count, loopCallback) {
    var date = moment().subtract(count, 'days').format(DATE_FORMAT);

    loadFromDatastore(date, function (err, result) {
        persistLocally(date, result, loopCallback)
    });
}

function persistLocally(date, result, loopCallback) {
    if (result) {
        rates[date] = result.data;
        loopCallback(null);
    } else {
        requestCurrencyRates(date, function (error, response, body) {
            loadCurrencyRates(error, response, body, date);
            loopCallback(null);
        });
    }
}

function deleteIrrelevantRates() {
    // var key1 = datastore.key([DATASTORE_KIND, "2016-06-30"]);
    // var key2 = datastore.key([DATASTORE_KIND, "2016-06-29"]);
    //
    // datastore.delete([key1, key2]);

    console.log(Object.keys(rates));
}
/**
 * Updates the currency rates by throwing away the oldest entries and replacing it with the latest.
 */
unitUtils.updateCurrencyRates = function () {
    var currentDate = moment().format(DATE_FORMAT);
    requestCurrencyRates(currentDate, updateCurrencyRates);
}

/**
 * Callback request function for the initialization of the currency rates.
 *
 * @param error possible error thrown by the request
 * @param response the response of the request
 * @param body the body containing the rates for a certain date
 * @param date the date for which the dates were requested
 */
function loadCurrencyRates(error, response, body, date) {
    if (!error && response.statusCode == 200) {
        var newRates = JSON.parse(body).rates;
        rates[date] = newRates;

        saveToDatastore(date, newRates);
    }
}

/**
 * Callback request function for updating the currency rates.
 *
 * @param error possible error thrown by the request
 * @param response the response of the request
 * @param body the body containing the rates for the most current date
 */
function updateCurrencyRates(error, response, body) {
    if (!error && response.statusCode == 200) {
        var newRates = JSON.parse(body).rates;

        var historicalDate = moment().subtract(CURRENCY_RATE_TIME_SPAN, 'days').format(DATE_FORMAT);
        var currentDate = moment().format(DATE_FORMAT);

        delete rates[historicalDate];
        rates[currentDate] = newRates;

        saveToDatastore(currentDate, newRates);
    }
}

/**
 * Pass-through function for requesting the currency rates for a certain date.
 * The currency API of choice is Fixer.io.
 *
 * @param date the date for which the currency rates should be requested
 * @param callback the callback function whenever a request has finished
 */
function requestCurrencyRates(date, callback) {
    var currencies = "USD,EUR,JPY,GBP,AUD";
    var url = "https://api.fixer.io/" + date + "?symbols=" + currencies;

    request(url, callback);
}

function saveToDatastore(date, rates) {
    var ratesKey = datastore.key([DATASTORE_KIND, date]);

    datastore.upsert({
        key: ratesKey,
        data: rates
    }, function (err) {
        if (err) {
            throw err;
        }
    });
}

unitUtils.loadFromDatastore = function () {
    var date = "2016-06-30";

    var callback = function (err, rates) {
        console.log(rates);
    };

    loadFromDatastore(date, callback);
}

function loadFromDatastore(date, callback) {
    var ratesKey = datastore.key([DATASTORE_KIND, date]);
    datastore.get(ratesKey, callback);
}


module.exports = unitUtils;
