(function() {
'use strict';

    angular
        .module('app.services')
        .factory('Toast', ToasterService);

    ToasterService.$inject = ['toaster'];
    function ToasterService(toaster) {
        var service = {
            show:show
        };
        
        return service;

        ////////////////
        function show(type, title, messages, timeout) {
            /**
             * Format for error messages, only msg param is used.
             * Can also just pass in object with msg field without being wrapped in array
             * @param body = [{ param: 'urlparam', msg: 'Invalid urlparam', value: 't1est' } ]]
             */
            type = type || 'success';
            timeout = timeout || 5000;
            // Ensure valid type
            if (!['success', 'warning', 'error', 'wait','note'].includes(type)) {
                type = 'success';
            }
            if(!Array.isArray(messages)) {
                messages = [messages];
            }
            var text = '';
            messages.map(function(msg) {
                text += '<ul style="list-style: none; padding-left:0;">';
                if (msg.msg) {
                text += '<li>' + msg.msg + '</li>';
                } else if (typeof msg === 'string') {
                text += '<li>' + msg + '</li>';
                }
                text += '</ul>';
            });
            // toaster.pop(type, title, text, null, 'trustedHtml');
            toaster.pop({
                type: type,
                title: title,
                body: text,
                bodyOutputType: 'trustedHtml',
                timeout: timeout
            });
         }
    }
})();