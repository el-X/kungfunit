(function () {
    'use strict';

    angular
        .module('kungfunit.home')
        .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController(unitService) {
        var vm = this;

        vm.quantities = [];

        vm.convertFromLeftToRight = convertFromLeftToRight;
        vm.convertFromRightToLeft = convertFromRightToLeft;

        retrieveQuantities();

        function retrieveQuantities() {
            unitService.getQuantities({}, function (quantities) {
                vm.quantities = quantities.data.quantities;
            });
        }

        function convertFromLeftToRight(converterScope) {
            unitService.convert({
                q: converterScope.lhsValue,
                source: converterScope.lhsUnit,
                target: converterScope.rhsUnit
            }, function (conversion) {
                converterScope.rhsValue = (conversion.data.conversions[0].convertedUnit);
            });
        }

        function convertFromRightToLeft(converterScope) {
            unitService.convert({
                q: converterScope.rhsValue,
                source: converterScope.rhsUnit,
                target: converterScope.lhsUnit
            }, function (conversion) {
                converterScope.lhsValue = (conversion.data.conversions[0].convertedUnit);
            });
        }
    }
})();
