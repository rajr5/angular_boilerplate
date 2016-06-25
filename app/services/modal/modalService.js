(function() {
'use strict';

  angular
    .module('app.services')
    .factory('Modal', Modal);

  Modal.$inject = ['$uibModal'];
  function Modal($uibModal) {
    var service = {
      open:open
    };

    return service;

    /**
     * @param title {String} Title of modal
     * @param content {string|mixed} Content for modal
     * @param buttons {object} Object to override 'ok' and 'cancel'  e.x. {confirm: 'Yes', cancel: 'No'}
     * @param templateUrl {String} Path to alternative template to use.  Content should match datatype expected by template
     */
    function open(title, content, buttons, templateUrl) {
      return $uibModal.open({
        templateUrl: templateUrl || 'services/modal/modal.html',
        controller: 'ModalController',
        controllerAs: 'vm',
        resolve: {
          title: function() {
            return title  || 'Confirm';
          },
          content: function() {
            return content || '';
          },
          buttons: function() {
            return buttons || {confirm: 'ok', cancel: 'cancel'};
          }
        }
      });
    }
  }
})();