(function() {
    'use strict';

    angular
        .module('app.services')
        .factory('Logger', Logger);

    Logger.$inject = ['$log'];

    function Logger($log) {
        var service = {

            error   : error,
            info    : info,
            success : success,
            warning : warning,
            debug   : debug,
            log     : $log.log
        };

        return service;
        /////////////////////

        function error(message, data) {
            $log.error('Error: ' + message, data);
        }

        function info(message, data) {
            $log.info('Info: ' + message, data);
        }

        function debug(message, data) {
            $log.debug('Debug: ' + message, data);
        }

        function success(message, data) {
            $log.info('Success: ' + message, data);
        }

        function warning(message, data) {
            $log.warn('Warning: ' + message, data);
        }
    }
}());
