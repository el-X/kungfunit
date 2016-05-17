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
            .primaryPalette('grey', {
                'default': 'A100'           // use white as the primary hue
            })
            .accentPalette('blue')
            .warnPalette('red')
            .backgroundPalette('grey', {
                'default': '50'             // use a light-grey as the background color
        });
    }

})();
