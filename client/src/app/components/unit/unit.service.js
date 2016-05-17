(function () {
    'use strict';

    angular
        .module('kungfunit.unit-service', [
            'ngResource'
        ])
        .factory('unitService', unitService);

    /*
     * This service factory provides information for units and unit conversions.
     */
    /** @ngInject */
    function unitService($resource) {
        var service = $resource('http://localhost:8080/units/', {}, {
            getQuantities: {
                method: 'GET'
            },
            convert: {
                url: 'http://localhost:8080/units/convert/',
                params: {
                    q: '@q',
                    source: '@source',
                    target: '@target'
                },
                method: "GET"
            }
        });

        return service;
    }
})();
