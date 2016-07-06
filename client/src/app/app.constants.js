/* global malarkey:false */
(function () {
    'use strict';

    angular
        .module('kungfunit')
        .constant('malarkey', malarkey)
        .constant('DATE_FORMAT', "YYYY-MM-DD")
        .constant('CURRENCY_RATE_TIME_SPAN', 5)
})();
