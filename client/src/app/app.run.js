(function () {
    'use strict';

    angular
        .module('kungfunit')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log) {
        $log.debug('Initialization finished');
    }

})();
