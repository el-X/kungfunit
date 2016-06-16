(function () {
    'use strict';

    angular
        .module('kungfunit.home')
        .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController(unitService, lodash) {
        var vm = this;

        vm.unitClasses = [];
        vm.unitQuantities = [];
        vm.unitQuantityNames = [];
        vm.selectedUnitQuantities = ["Length", "Time", "Temperature"];
        vm.searchTerm = "";
        vm.toggle = false;
        vm.logMessage = "2016.05.19: 13:37 - Currency: 1 Bitcoin (BTC) equals 392.16 Euro (EUR) on 2016.05.19";

        vm.convertFromLeftToRight = convertFromLeftToRight;
        vm.convertFromRightToLeft = convertFromRightToLeft;
        vm.isUnitQuantitySelected = isUnitQuantitySelected;
        vm.toggleConverter = toggleConverter;

        retrieveUnitClasses();

        /**
         * Retrives the unit classes and its contained quantities via REST.
         */
        function retrieveUnitClasses() {
            unitService.getUnits({}, function (unitClasses) {
                vm.unitClasses = unitClasses.data.classes;

                // get all available unit quantities and quantity names
                lodash.forEach(vm.unitClasses, function (unitClass) {
                    vm.unitQuantities = lodash.concat(vm.unitQuantities, unitClass.quantities);
                    vm.unitQuantityNames = lodash.concat(vm.unitQuantityNames, lodash.map(unitClass.quantities, "name"));
                });
            });
        }

        /**
         * Performs a conversion using the left hand side value with the right hand side value as the result.
         *
         * @param converterScope contains all parameters necessary for the conversion
         */
        function convertFromLeftToRight(converterScope) {
            unitService.convert({
                q: converterScope.lhsValue,
                source: converterScope.lhsUnit,
                target: converterScope.rhsUnit
            }, function (conversion) {
                converterScope.rhsValue = (conversion.data.conversions[0].convertedUnit);
            });
        }

        /**
         * Performs a conversion using the right hand side value with the left hand side value as the result.
         *
         * @param converterScope contains all parameters necessary for the conversion
         */
        function convertFromRightToLeft(converterScope) {
            unitService.convert({
                q: converterScope.rhsValue,
                source: converterScope.rhsUnit,
                target: converterScope.lhsUnit
            }, function (conversion) {
                converterScope.lhsValue = (conversion.data.conversions[0].convertedUnit);
            });
        }

        /**
         * Determines whether or not a certain unit quantity is selected, so that its corresponding converter is displayed.
         *
         * @param unitQuantityName the name of the quantity whose selection should be checked
         * @returns true if the quantity name is present; false otherwise
         */
        function isUnitQuantitySelected(unitQuantityName) {
            return lodash.includes(vm.selectedUnitQuantities, unitQuantityName);
        }

        /**
         * Toggles the selection of a converter using its quantity name.
         *
         * @param unitQuantityName the name of the quantity whose converter should be either displayed or not
         */
        function toggleConverter(unitQuantityName) {
            if (lodash.includes(vm.selectedUnitQuantities, unitQuantityName)) {
                lodash.pull(vm.selectedUnitQuantities, unitQuantityName);
            } else {
                vm.selectedUnitQuantities.push(unitQuantityName);
            }
        }

    }
})();
