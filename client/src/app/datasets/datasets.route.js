(function () {
    'use strict';

    angular
        .module('kungfunit.datasets')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider) {
        $stateProvider.state('datasets', {
            url: '/datasets',
            views: {
                "content": {
                    controller: 'DatasetsController',
                    controllerAs: 'vm',         // access the controller by using 'vm' as variable
                    templateUrl: 'app/datasets/datasets.html'
                }
            },
            resolve: {
                $title: function() { return 'Datasets'; }   // the page title
            }
        });
    }

})();
