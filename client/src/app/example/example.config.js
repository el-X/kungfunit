(function () {
    'use strict';

    angular
        .module('kungfunit.example')
        .config(config);

    /** @ngInject */
    function config(toastrConfig) {
        // Set options third-party lib
        toastrConfig.allowHtml = true;
        toastrConfig.timeOut = 3000;
        toastrConfig.positionClass = 'toast-top-right';
        toastrConfig.preventDuplicates = true;
        toastrConfig.progressBar = true;
    }

})();
