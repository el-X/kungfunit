(function () {
    'use strict';

    angular
        .module('kungfunit')
        .config(config);

    /** @ngInject */
    function config($logProvider, $mdThemingProvider) {
        // enable logging
        $logProvider.debugEnabled(true);

        // configure the Angular Material theme colors
        $mdThemingProvider.theme('default')
            .primaryPalette('grey')
            .accentPalette('blue-grey')
            .warnPalette('red')
            .backgroundPalette('grey', {
                'default': 'A100'             // use white as the background color
            });
    }
})();
