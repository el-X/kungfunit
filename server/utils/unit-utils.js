'use strict';

const CURRENCY_RATE_TIME_SPAN = 5;
const DATE_FORMAT = "YYYY-MM-DD";
const DATASTORE_KIND = "Rates";
const CURRENCY_RATE_API_URL = "https://api.fixer.io/";

var async = require('async');
var config = require('../config');
var fx = require('money');
var gcloud = require('gcloud');
var lodash = require('lodash');
var logger = require('winston');
var math = require('mathjs');
var moment = require('moment');
var request = require('request');

process.env.GCLOUD_PROJECT = process.env.GCLOUD_PROJECT ? process.env.GCLOUD_PROJECT : config['GCLOUD_PROJECT'];
var datastore = gcloud.datastore({
    projectId: process.env.GCLOUD_PROJECT
});

var unitUtils = {};
var rates = {};

fx.base = "EUR";    // the base currency

/**
 * Converts the given values from a source to a specific target unit.
 * Only units other than currencies are allowed.
 *
 * @param values the values to be converted
 * @param source the values source unit
 * @param target the values target unit
 * @returns {number} the value for the desired target unit
 */
unitUtils.convertUnit = function (values, source, target) {
    var conversions = [];

    lodash.each(values, function (value) {
        var conversion = math.unit(value, source).toNumber(target);
        conversions.push({"convertedUnit": conversion});
    });

    return conversions;
}

/**
 * Converts the provided currency values from a source to a specific target currency.
 * Only currencies are supported.
 *
 * @param values the currency values to be converted
 * @param source the values source currency
 * @param target the values target currency
 * @param date the date indication for the currency rate
 * @returns {array} an array containing the currency values for the desired target currency
 */
unitUtils.convertCurrency = function (values, source, target, date) {
    var conversions = [];
    fx.rates = rates[date];

    lodash.each(values, function (value) {
        var conversion = fx(value).from(source).to(target);
        conversion = math.round(conversion, 2);
        conversions.push({"convertedUnit": conversion});
    });

    return conversions;
}

/**
 * Updates the currency rates by requesting new ones for the current date and deleting older rates prior to the
 * specified time span.
 */
unitUtils.updateCurrencyRates = function () {
    var currentDate = getDateForDaysPrior(0);
    requestCurrencyRatesForDate(currentDate, handleUpdatedCurrencyRates);
}

/**
 * Initializes the currency rates on startup for the given currency rate time span.
 */
unitUtils.initCurrencyRates = function () {
    var count = 0;
    var datePrior;

    // perform a synchronous currency rate retrieval in the shape of a while-loop
    async.whilst(
        function () {
            return count < CURRENCY_RATE_TIME_SPAN;
        },
        function (loopCallback) {
            datePrior = getDateForDaysPrior(count);
            initCurrencyRatesForDate(datePrior, loopCallback);
            count++;
        },
        function () {        // called when the loop finished
            deleteRatesFromDatastorePriorDate(datePrior);
        }
    );
}

/**
 * Performs an initialization of the currency rates for a specific date.
 *
 * @param date the date for which the currency rates should be initialized
 * @param loopCallback callback function to be run when the initialization for the given date completed
 */
function initCurrencyRatesForDate(date, loopCallback) {
    loadCurrencyRatesFromDatastoreForDate(date, function (error, result) {
        attemptDatastoreRetrieval(date, result, loopCallback)
    });
}

/**
 * Responsible for loading datastore currency rates for a specific date.
 *
 * @param date the date for which the currency rates should be loaded
 * @param callback the callback function handling the results of the loading procedure
 */
function loadCurrencyRatesFromDatastoreForDate(date, callback) {
    var ratesKey = datastore.key([DATASTORE_KIND, date]);
    datastore.get(ratesKey, callback);
}

/**
 * Attempts to retrieve the currency rates from the datastore. Two things could go wrong here.
 * First: Currency rates for the given date don't exist. In this case the currency rate API is called whose result is
 * then stored in the datastore and in the local storage.
 * Second: The datastore service could not be reached. In that case the currency rate API is called whose result is only
 * stored locally.
 *
 * @param date the date for which the currency rates were retrieved
 * @param result the result delivered by the datastore
 * @param loopCallback callback function to be called when the currency rate retrieval for the date finished
 */
function attemptDatastoreRetrieval(date, result, loopCallback) {
    if (result) {
        rates[date] = result.data;
        loopCallback(null);
    } else {
        requestCurrencyRatesForDate(date, function (error, response, body) {
            handleInitializedCurrencyRates(error, response, body, date);
            loopCallback(null);
        });
    }
}

/**
 * Pass-through function for requesting the currency rates for a certain date.
 * The currency API of choice is Fixer.io.
 *
 * @param date the date for which the currency rates should be requested
 * @param callback the callback function for the finished request
 */
function requestCurrencyRatesForDate(date, callback) {
    var supportedCurrencies = "USD,EUR,JPY,GBP,AUD";
    var url = CURRENCY_RATE_API_URL + date + "?symbols=" + supportedCurrencies;

    request(url, callback);
}

/**
 * Callback request function for handling the acquired currency rates of the API.
 *
 * @param error possible error thrown by the request
 * @param response the response of the request
 * @param body the body containing the rates for a certain date
 * @param date the date for which the dates were requested
 */
function handleInitializedCurrencyRates(error, response, body, date) {
    if (!error && response.statusCode == 200) {
        var newRates = JSON.parse(body).rates;
        rates[date] = newRates;

        saveCurrencyRatesToDatastoreForDate(date, newRates);
    }
}

/**
 * Saves the given currency rates for the provided date to the datastore.
 *
 * @param date the date for which the datastore should be saved
 * @param rates the currency rates to be stored in the datastore
 */
function saveCurrencyRatesToDatastoreForDate(date, rates) {
    var ratesKey = datastore.key([DATASTORE_KIND, date]);

    datastore.upsert({
        key: ratesKey,
        data: rates
    }, function (error) {
        if (error) {
            logger.warn("Currency rates could not be saved to datastore. Using local storage instead.");
        }
    });
}

/**
 * Deletes all currency rate entries that were made prior to the date provided.
 *
 * @param priorDate currency rate entities prior to this date will be deleted
 */
function deleteRatesFromDatastorePriorDate(priorDate) {
    var dateKey = datastore.key([DATASTORE_KIND, priorDate]);
    var query = datastore.createQuery()
        .filter('__key__', "<", dateKey)
        .select('__key__');

    datastore.runQuery(query, function (error, keysToDelete) {
        if (!error) {
            var filteredKeysToDelete = lodash.map(keysToDelete, 'key');
            datastore.delete(filteredKeysToDelete);
        }
    });
}

/**
 * Callback request function for handling the updated currency rates.
 *
 * @param error possible error thrown by the request
 * @param response the response of the request
 * @param body the body containing the rates for the most current date
 */
function handleUpdatedCurrencyRates(error, response, body) {
    if (!error && response.statusCode == 200) {
        var newRates = JSON.parse(body).rates;
        var historicalDate = getDateForDaysPrior(CURRENCY_RATE_TIME_SPAN);
        var currentDate = getDateForDaysPrior(0);

        delete rates[historicalDate];
        rates[currentDate] = newRates;

        saveCurrencyRatesToDatastoreForDate(currentDate, newRates);
        deleteRatesFromDatastorePriorDate(getDateForDaysPrior(CURRENCY_RATE_TIME_SPAN - 1));
    }
}

/**
 * Helper function for returning a date string in the desired format.
 *
 * @param daysPrior determines how many days prior to the current one, the date should be returned
 * @returns {string} the date of the desired day as a string
 */
function getDateForDaysPrior(daysPrior) {
    return moment().subtract(daysPrior, 'days').format(DATE_FORMAT);
}

module.exports = unitUtils;
