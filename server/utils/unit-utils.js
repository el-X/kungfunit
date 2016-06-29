'use strict';

const CURRENCY_TIME_SPAN = 5;
const DATE_FORMAT = "YYYY-MM-DD";

var fx = require('money');
var math = require('mathjs');
var moment = require('moment');
var request = require('request');

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
 * Initializes the currency rates on startup.
 */
unitUtils.initCurrencyRates = function () {
    for (var i = 0; i < CURRENCY_TIME_SPAN; i++) {
        var date = moment().subtract(i, 'days').format(DATE_FORMAT);

        requestCurrencyRates(date, function (error, response, body) {
            initCurrencyRates(error, response, body, this.date);
        }.bind({date: date}));  // needed or else the last date of the iteration would be used
    }
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
function initCurrencyRates(error, response, body, date) {
    if (!error && response.statusCode == 200) {
        var newRates = JSON.parse(body).rates;
        rates[date] = newRates;
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

        var historicalDate = moment().subtract(CURRENCY_TIME_SPAN, 'days').format(DATE_FORMAT);
        var currentDate = moment().format(DATE_FORMAT);

        delete rates[historicalDate];
        rates[currentDate] = newRates;
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

module.exports = unitUtils;
