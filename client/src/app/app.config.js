(function () {
    'use strict';

    angular
        .module('kungfunit')
        .config(config);

    /** @ngInject */
    function config($logProvider, $mdThemingProvider) {
        // Enable log
        $logProvider.debugEnabled(true);

        $mdThemingProvider.theme('default')
            .primaryPalette('grey')
            .accentPalette('blue-grey')
            .warnPalette('red')
            .backgroundPalette('grey', {
                'default': 'A100'             // use white as the background color
        });
    }

})();
