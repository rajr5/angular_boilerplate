(function() {
'use strict';

    angular
        .module('app.services')
        .controller('ModalController', ModalController);

    ModalController.$inject = ['$uibModalInstance', 'title', 'content', 'buttons'];
    function ModalController($uibModalInstance, title, content, buttons) {
        var vm = this;
        vm.title = title;
        vm.content = content;
        vm.ok = ok;
        vm.cancel = cancel;
        vm.buttons = buttons;

        activate();

        ////////////////

        function activate() {

        }

        function ok() {
          $uibModalInstance.close('ok');
        }

        function cancel() {
          $uibModalInstance.dismiss('cancel');
        }
    }
})();