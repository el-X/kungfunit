(function () {
    'use strict';

    angular
        .module('kungfunit.about')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider) {
        $stateProvider.state('about', {
            url: '/about',
            views: {
                "content": {
                    templateUrl: 'app/about/about.html'
                }
            },
            resolve: {
                $title: function () {
                    return 'About';     // the page title
                }
            }
        });
    }

})();
