(function () {
    'use strict';

    angular
        .module('kungfunit.home')
        .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController(unitService, lodash, moment) {
        var vm = this;

        vm.date = moment().toDate();
        vm.minDate = new Date(
            vm.date.getFullYear(),
            vm.date.getMonth(),
            vm.date.getDate() - 4);
        vm.maxDate = new Date();

        vm.unitClasses = [];
        vm.unitQuantities = [];
        vm.unitQuantityNames = [];
        vm.selectedUnitQuantities = ["Area", "Length", "Currency", "Volume", "Binary"];
        vm.searchTerm = "";
        vm.logMessages = "";

        vm.convertFromLeftToRight = convertFromLeftToRight;
        vm.convertFromRightToLeft = convertFromRightToLeft;
        vm.isUnitQuantitySelected = isUnitQuantitySelected;
        vm.toggleConverter = toggleConverter;

        retrieveUnitClasses();

        /**
         * Retrieves the unit classes and its contained quantities via REST.
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
            var date = formatDate(converterScope.date);

            unitService.convert({
                q: converterScope.lhsValue,
                source: converterScope.lhsUnit.symbol,
                target: converterScope.rhsUnit.symbol,
                date: date
            }, function (conversion) {
                converterScope.rhsValue = (conversion.data.conversions[0].convertedUnit);
                logConversion(converterScope.quantityName, converterScope.lhsValue, converterScope.lhsUnit.name, converterScope.lhsUnit.symbol,
                    converterScope.rhsValue, converterScope.rhsUnit.name, converterScope.rhsUnit.symbol, converterScope.date);
            });
        }

        /**
         * Performs a conversion using the right hand side value with the left hand side value as the result.
         *
         * @param converterScope contains all parameters necessary for the conversion
         */
        function convertFromRightToLeft(converterScope) {
            var date = formatDate(converterScope.date);

            unitService.convert({
                q: converterScope.rhsValue,
                source: converterScope.rhsUnit.symbol,
                target: converterScope.lhsUnit.symbol,
                date: date
            }, function (conversion) {
                converterScope.lhsValue = (conversion.data.conversions[0].convertedUnit);
                logConversion(converterScope.quantityName, converterScope.lhsValue, converterScope.lhsUnit.name, converterScope.lhsUnit.symbol,
                    converterScope.rhsValue, converterScope.rhsUnit.name, converterScope.rhsUnit.symbol, converterScope.date);
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

        /**
         * Responsible for logging the conversions performed.
         *
         * @param quantityName the name of the quantity in which the conversion was
         * @param sourceValue the source value
         * @param sourceUnitName the full name of the source unit
         * @param sourceUnitSymbol the symbolic name of the source unit
         * @param targetValue the target value
         * @param targetUnitName the full name of the target unit
         * @param targetUnitSymbol the symbolic name of the target unit
         * @param currencyRateDate the date of the currency rate used for the conversion
         */
        function logConversion(quantityName, sourceValue, sourceUnitName, sourceUnitSymbol, targetValue, targetUnitName, targetUnitSymbol, currencyRateDate) {
            var date = moment().format("YYYY.MM.DD HH:mm:ss");

            var logMessage = date + " - " + quantityName + ": ";
            logMessage += sourceValue + " " + sourceUnitName + " [" + sourceUnitSymbol + "]";
            logMessage += " = ";
            logMessage += targetValue + " " + targetUnitName + " [" + targetUnitSymbol + "]";
            logMessage += currencyRateDate ? " on " + moment(currencyRateDate).format("YYYY.MM.DD") : "";

            vm.logMessages = vm.logMessages ? logMessage + "\n" + vm.logMessages : logMessage;
        }

        /**
         * Formats the date in order for its currency to be convertible.
         */
        function formatDate(date) {
            return date ? moment(date).format("YYYY-MM-DD") : null;
        }
    }
})();
