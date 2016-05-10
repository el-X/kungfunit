(function () {
    'use strict';

    angular
        .module('kungfunit.example')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider) {
        $stateProvider.state('example', {
            url: '/example',
            views: {
                "content": {
                    controller: 'ExampleController',
                    controllerAs: 'vm',         // access the controller by using 'vm' as variable
                    templateUrl: 'app/example/example.html'
                }
            },
            resolve: {
                $title: function() { return 'Example'; }   // the page title
            }
        });
    }

})();
