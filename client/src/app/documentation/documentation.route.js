(function () {
    'use strict';

    angular
        .module('kungfunit.documentation')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider) {
        $stateProvider.state('documentation', {
            url: '/documentation',
            views: {
                "content": {
                    templateUrl: 'app/documentation/documentation.html'
                }
            },
            resolve: {
                $title: function () {
                    return 'Documentation';     // the page title
                }
            }
        });
    }

})();
