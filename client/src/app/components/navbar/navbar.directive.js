(function () {
    'use strict';

    angular
        .module('kungfunit')
        .directive('navbar', navbar);

    /**
     * The navigation bar is implemented as a directive, which makes testing and reusing it much easier.
     *
     * @ngInject
     */
    function navbar() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/navbar/navbar.html'
        };

        return directive;
    }
})();
