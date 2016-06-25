(function() {
'use strict';

  angular
    .module('app.auth')
    .controller('ActivateController', ActivateController);

  ActivateController.$inject = ['$rootScope', '$location', '$window', '$auth', 'Account', 'Toast'];
  function ActivateController($rootScope, $location, $window, $auth, Account, Toast) {
    var vm = this;

    activate();

    ////////////////

    function activate() {
      activateAccount();
    }

    function activateAccount() {
      var token = $location.search().token;
      Account.activateAccount(token)
      .then((response) => {
        $auth.setToken(response);
        $rootScope.currentUser = response.data.user;
        $window.localStorage.user = JSON.stringify(response.data.user);
        $location.path('/');
      })
      .catch((response) => {
        $location.path('/');
        Toast.show('error', 'Error', response.error || response.data);
      });
    }
  }
})();