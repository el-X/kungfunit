(function () {
    'use strict';

    angular
        .module('about')
        .controller('AboutController', AboutController);

    /** @ngInject */
    function AboutController() {
        var vm = this;

        vm.about = "Please work!";
    }
})();
