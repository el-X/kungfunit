(function () {
    'use strict';

    describe('directive navbar', function () {
        var element;

        beforeEach(module('kungfunit'));
        beforeEach(inject(function ($compile, $rootScope) {
            element = angular.element('<navbar></navbar>');

            $compile(element)($rootScope.$new());
            $rootScope.$digest();
        }));

        it('should be compiled', function () {
            expect(element.html()).not.toEqual(null);
        });
    });
})();
