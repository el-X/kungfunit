(function () {
    'use strict';

    angular
        .module('kungfunit')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
    }
})();
