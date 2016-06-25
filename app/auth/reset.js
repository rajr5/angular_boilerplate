(function() {
'use strict';

  angular
    .module('app.auth')
    .controller('ResetController', ResetController);

  ResetController.$inject = ['$rootScope', '$location', '$window', '$auth', 'Account', 'Toast'];
  function ResetController($rootScope, $location, $window, $auth, Account, Toast) {
    var vm = this;

    vm.resetPassword = resetPassword;

    activate();

    ////////////////

    function activate() {

      }

    function resetPassword() {
      var token = $location.search().token;
      Account.resetPassword(token, vm.user)
      .then((response) => {
        $auth.setToken(response);
        $rootScope.currentUser = response.data.user;
        $window.localStorage.user = JSON.stringify(response.data.user);
        $location.path('/');
      })
      .catch((response) => {
        Toast.show('error', 'Error', response.data);
      });
    }
  }
})();
