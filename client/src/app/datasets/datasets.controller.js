(function () {
    'use strict';

    angular
        .module('kungfunit.datasets')
        .controller('DatasetsController', DatasetsController);

    /**
     * Controller for handling the validation and conversion of datasets.
     *
     * @param DATE_FORMAT the date format used for determining the currency rates
     * @param CURRENCY_RATE_TIME_SPAN the desired time span for the currency rates
     * @param lodash utility for working with arrays, numbers, objects, strings, etc.
     * @param moment date library for parsing, validating, manipulating, and formatting dates
     * @param unitService offers backend services for retrieving unit information and converting units
     * @ngInject
     */
    function DatasetsController(DATE_FORMAT, CURRENCY_RATE_TIME_SPAN, lodash, moment, unitService) {
        var vm = this;

        vm.date = moment().toDate();
        vm.minDate = moment().subtract(CURRENCY_RATE_TIME_SPAN - 1, 'days').toDate();
        vm.maxDate = moment().toDate();
        vm.ready = false;
        vm.invalid = false;
        vm.unitClasses = [];
        vm.selectedQuantity = "";
        vm.selectedSourceUnit = "";
        vm.selectedTargetUnit = "";
        vm.sourceDataset = "";
        vm.targetDataset = "";

        vm.convertDataset = convertDataset;
        vm.determineButtonTooltip = determineButtonTooltip;
        vm.updateButtonState = updateButtonState;

        retrieveUnitClasses();

        /**
         * Retrieves the unit classes and its contained quantities from the backend.
         */
        function retrieveUnitClasses() {
            unitService.getUnits({}, function (unitClasses) {
                vm.unitClasses = unitClasses.data.classes;
            });
        }

        /**
         * Validates and converts the source dataset.
         * This function is called whenever the corresponding button is clicked on.
         */
        function convertDataset() {
            vm.ready = false;
            var values = lodash.split(vm.sourceDataset, ",");

            if (isValid(values)) {
                retrieveConversion(values);
            }
        }

        /**
         * Validates the value array provided. The whole dataset is considered invalid in case one of the values is
         * either an empty string or can not be parsed to a number.
         *
         * @param values the split dataset values as an array
         * @returns {boolean} true in case all of the values are valid; false otherwise
         */
        function isValid(values) {
            vm.invalid = lodash.some(values, function (value) {
                var empty = !(/\S/.test(value));
                return empty || lodash.isNaN(Number(value));
            });

            return !vm.invalid;
        }

        /**
         * Retrieves the conversion for the provided values.
         *
         * @param values the validated values that should be converted
         */
        function retrieveConversion(values) {
            unitService.convert({
                q: values,
                source: vm.selectedSourceUnit,
                target: vm.selectedTargetUnit,
                date: formatDate(vm.date)
            }, function (result) {
                var conversionsArray = lodash.map(result.data.conversions, 'convertedUnit');
                vm.targetDataset = lodash.join(conversionsArray, ", ");
            });
        }

        /**
         * Formats the date in order for its currency to be convertible. If no date is specified "null" is returned.
         */
        function formatDate(date) {
            return vm.selectedQuantity.name == 'Currency' ? moment(date).format(DATE_FORMAT) : null;
        }

        /**
         * Updates the button state whenever a change to any input element of the view occurs.
         */
        function updateButtonState() {
            vm.invalid = false;
            vm.ready = !(!vm.sourceDataset || vm.sourceDataset.length === 0) && vm.selectedQuantity;
        }

        /**
         * Determines the tooltip text for the button based on its current state.
         *
         * @returns {string} the tooltip text determined
         */
        function determineButtonTooltip() {
            if (vm.ready) {
                return "CONVERT";
            } else if (vm.invalid) {
                return "VALIDATION ERROR";
            } else {
                return "AWAITING INPUT";
            }
        }
    }
})();
