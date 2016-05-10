(function () {
    'use strict';

    angular
        .module('kungfunit')
        .directive('navbar', navbar);

    /** @ngInject */
    function navbar() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/navbar/navbar.html',
            controller: NavbarController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        /** @ngInject */
        function NavbarController() {
        }
    }

})();
