(function () {
    'use strict';

    angular
        .module('kungfunit.home')
        .controller('HomeController', HomeController);

    /**
     * Controller for handling the conversion, logging and filtering of the converters.
     *
     * @param CURRENCY_DATE_FORMAT the date format used for determining the currency rates
     * @param CURRENCY_RATE_TIME_SPAN the desired time span for the currency rates
     * @param LOG_DATE_FORMAT the date format used for logging purposes
     * @param lodash utility for working with arrays, numbers, objects, strings, etc.
     * @param moment date library for parsing, validating, manipulating, and formatting dates
     * @param unitService offers backend services for retrieving unit information and converting units
     * @ngInject
     */
    function HomeController(CURRENCY_DATE_FORMAT, CURRENCY_RATE_TIME_SPAN, LOG_DATE_FORMAT, lodash, moment, unitService) {
        var vm = this;

        vm.date = moment().toDate();
        vm.minDate = moment().subtract(CURRENCY_RATE_TIME_SPAN - 1, 'days').toDate();
        vm.maxDate = moment().toDate();
        vm.unitClasses = [];
        vm.unitQuantities = [];
        vm.unitQuantityNames = [];
        vm.selectedUnitQuantities = ["Area", "Length", "Currency", "Volume", "Binary"];
        vm.searchTerm = "";
        vm.logMessages = "";

        vm.convertFromLeftToRight = convertFromLeftToRight;
        vm.convertFromRightToLeft = convertFromRightToLeft;
        vm.isUnitQuantitySelected = isUnitQuantitySelected;
        vm.toggleConverterSelection = toggleConverterSelection;

        retrieveUnitClasses();

        /**
         * Retrieves the unit classes and its contained quantities from the backend.
         */
        function retrieveUnitClasses() {
            unitService.getUnits({}, function (unitClasses) {
                vm.unitClasses = unitClasses.data.classes;

                // get all available unit quantities and quantity names to work with
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
            retrieveConversion(converterScope.lhsValue, converterScope.lhsUnit.symbol,
                converterScope.rhsUnit.symbol, converterScope.date, function (conversion) {
                    handleConversionFromLeftToRight(conversion, converterScope);
                });
        }

        /**
         * Callback function for handling the retrieved conversion with the right hand side being the conversion target.
         *
         * @param conversion the conversion result of the backend
         * @param converterScope the scope of the converter
         */
        function handleConversionFromLeftToRight(conversion, converterScope) {
            converterScope.rhsValue = (conversion.data.conversions[0].convertedUnit);
            logConversion(converterScope);
        }

        /**
         * Performs a conversion using the right hand side value with the left hand side value as the result.
         *
         * @param converterScope contains all parameters necessary for the conversion
         */
        function convertFromRightToLeft(converterScope) {
            retrieveConversion(converterScope.rhsValue, converterScope.rhsUnit.symbol,
                converterScope.lhsUnit.symbol, converterScope.date, function (conversion) {
                    handleConversionFromRightToLeft(conversion, converterScope);
                });
        }

        /**
         * Callback function for handling the retrieved conversion with the left hand side being the conversion target.
         *
         * @param conversion the conversion result of the backend
         * @param converterScope the scope of the converter
         */
        function handleConversionFromRightToLeft(conversion, converterScope) {
            converterScope.lhsValue = (conversion.data.conversions[0].convertedUnit);
            logConversion(converterScope);
        }

        /**
         * Initiates the conversion with the provided values, units and the date.
         *
         * @param value the value that should be converted
         * @param sourceUnit the values source unit
         * @param targetUnit the values target unit
         * @param date an optional date in case of a currency conversion
         * @param callback the callback function which handles the retrieved conversion
         */
        function retrieveConversion(value, sourceUnit, targetUnit, date, callback) {
            unitService.convert({
                q: value,
                source: sourceUnit,
                target: targetUnit,
                date: formatDate(date, CURRENCY_DATE_FORMAT)
            }, callback);
        }

        /**
         * Responsible for logging the conversions performed.
         *
         * @param converterScope contains all log-relevant information
         */
        function logConversion(converterScope) {
            var date = moment().format(LOG_DATE_FORMAT + " HH:mm:ss");
            var logMessage = "";

            logMessage += date + " - " + converterScope.quantityName + ": ";
            logMessage += converterScope.lhsValue + " " + converterScope.lhsUnit.name + " [" + converterScope.lhsUnit.symbol + "]";
            logMessage += " = ";
            logMessage += converterScope.rhsValue + " " + converterScope.rhsUnit.name + " [" + converterScope.rhsUnit.symbol + "]";
            logMessage += converterScope.date ? " on " + formatDate(converterScope.date, LOG_DATE_FORMAT) : "";

            vm.logMessages = vm.logMessages ? logMessage + "\n" + vm.logMessages : logMessage;
        }

        /**
         * Formats the date according to the provided date format.
         *
         * @param date the date that should be formatted
         * @param format the format of the desired date
         * @returns {string} the date in the desired format in case it is defined; null otherwise
         */
        function formatDate(date, format) {
            return date ? moment(date).format(format) : null;
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
        function toggleConverterSelection(unitQuantityName) {
            if (lodash.includes(vm.selectedUnitQuantities, unitQuantityName)) {
                lodash.pull(vm.selectedUnitQuantities, unitQuantityName);
            } else {
                vm.selectedUnitQuantities.push(unitQuantityName);
            }
        }
    }
})();
