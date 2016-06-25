(function() {
'use strict';

  angular
    .module('app.auth')
    .controller('ForgetController', ForgetController);

  ForgetController.$inject = ['Account', 'Toast'];
  function ForgetController(Account, Toast) {
    var vm = this;
    vm.forgotPassword = forgotPassword;
    vm.user = null;

    activate();

    ////////////////

    function activate() { }
    }

    function forgotPassword() {
      Account.forgotPassword(vm.user)
        .then(function(response) {
          Toast.show('success', 'Success', response.data);
        })
        .catch(function(response) {
          Toast.show('error', 'Error', response.data);
        });
    }
})();
