(function () {
    'use strict';

    angular
        .module('kungfunit.home')
        .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController() {
        var vm = this;

        vm.home = "Home";
    }
})();
