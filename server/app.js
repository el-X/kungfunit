'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require('path');

var routes = require('./routes/index');
var units = require('./routes/units');
var unitUtils = require('./utils/unit-utils');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// provide the following routes
app.use('/', routes);
app.use('/units', units);

// initialize the currency rates from either the gcloud datastore and/or via API calls
unitUtils.initCurrencyRates();

// If nothing matches, the index file will be sent to the client side where Angular will take care of it.
// This is needed due to the fact that Express cannot handle URLs without the hash notation.
app.use('/*', function (req, res) {
    var indexFile = path.resolve(__dirname, './public/index.html');
    res.sendFile(indexFile);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 * Error handlers
 */

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces are leaked to the user
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

module.exports = app;
