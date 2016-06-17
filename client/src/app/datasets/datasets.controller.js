(function () {
    'use strict';

    angular
        .module('kungfunit.datasets')
        .controller('DatasetsController', DatasetsController);

    /** @ngInject */
    function DatasetsController(unitService) {
        var vm = this;
        vm.unitClasses = [];

        retrieveUnitClasses();

        /**
         * Retrieves the unit classes and its contained quantities via REST.
         */
        function retrieveUnitClasses() {
            unitService.getUnits({}, function (unitClasses) {
                vm.unitClasses = unitClasses.data.classes;
            });
        }
    }
})();
