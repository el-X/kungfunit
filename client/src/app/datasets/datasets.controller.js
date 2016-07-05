(function () {
    'use strict';

    angular
        .module('kungfunit.datasets')
        .controller('DatasetsController', DatasetsController);

    /** @ngInject */
    function DatasetsController(unitService, lodash, moment) {
        var vm = this;

        vm.date = moment().toDate();
        vm.minDate = moment().subtract(4, 'days').toDate(); // only five days should be selectable
        vm.maxDate = moment().toDate();
        vm.invalid = false;
        vm.unitClasses = [];
        vm.selectedQuantity = "";
        vm.selectedSourceUnit = "";
        vm.selectedTargetUnit = "";
        vm.sourceDataset = "";
        vm.targetDataset = "";

        vm.convertDataset = convertDataset;

        retrieveUnitClasses();

        /**
         * Retrieves the unit classes and its contained quantities via REST.
         */
        function retrieveUnitClasses() {
            unitService.getUnits({}, function (unitClasses) {
                vm.unitClasses = unitClasses.data.classes;
            });
        }

        function convertDataset() {
            var values = lodash.split(vm.sourceDataset, ",");

            if (isValid(values)) {
                retrieveConversion(values);
            }
        }

        function isValid(values) {
            vm.invalid = lodash.some(values, function (value) {
                var empty = !(/\S/.test(value));
                return empty || lodash.isNaN(Number(value));
            });

            return !vm.invalid;
        }

        function retrieveConversion(values) {
            unitService.convert({
                q: values,
                source: vm.selectedSourceUnit,
                target: vm.selectedTargetUnit,
                date: formatDate(vm.date)
            }, function (conversions) {
                var filteredConversions = lodash.map(conversions.data.conversions, 'convertedUnit');
                vm.targetDataset = lodash.join(filteredConversions, ", ");
            });
        }

        /**
         * Formats the date in order for its currency to be convertible. If no date is specified "null" will be
         * returned.
         */
        function formatDate(date) {
            return vm.selectedQuantity.name == 'Currency' ? moment(date).format("YYYY-MM-DD") : null;
        }

    }
})();
