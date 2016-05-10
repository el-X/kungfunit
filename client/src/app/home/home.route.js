(function () {
    'use strict';

    angular
        .module('kungfunit.home')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider) {
        $stateProvider.state('home', {
            url: '/home',
            views: {
                "content": {
                    controller: 'HomeController',
                    controllerAs: 'vm',         // access the controller by using 'vm' as variable
                    templateUrl: 'app/home/home.html'
                }
            },
            resolve: {
                $title: function() { return 'Home'; }   // the page title
            }
        });
    }

})();
