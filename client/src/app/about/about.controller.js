(function () {
    'use strict';

    angular
        .module('kungfunit.about')
        .controller('AboutController', AboutController);

    /** @ngInject */
    function AboutController() {
        var vm = this;

        vm.about = "About";
    }
})();
