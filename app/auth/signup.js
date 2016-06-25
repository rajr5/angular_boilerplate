(function() {
'use strict';

  angular
    .module('app.auth')
    .controller('SignupController', SignupController);

  SignupController.$inject = ['$rootScope', '$location', '$window', '$auth', 'Toast'];
  function SignupController($rootScope, $location, $window, $auth, Toast) {
    var vm = this;

    vm.buttonDisable = false;
    vm.signup = signup;

    activate();

    ////////////////

    function activate() {

    }

    function signup() {
      vm.buttonDisable = true;
      $auth.signup(vm.user)
      .then(function(response) {
          if (response.data.user) {
            $auth.setToken(response);
            $rootScope.currentUser = response.data.user;
            $window.localStorage.user = JSON.stringify(response.data.user);
            $location.path('/');
          } else {
            vm.user = null;
            $location.path('/login');
          }
          Toast.show('success', 'Success', response.data);

      })
      .catch(function(response) {
        Toast.show('error', 'Error', response.data);
        vm.buttonDisable = false;
      });
    }
  }
})();