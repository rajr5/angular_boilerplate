(function() {
'use strict';

  angular
    .module('app.layout')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$location', '$window', '$auth'];
  function HeaderController($scope, $location, $window, $auth) {
    var vm = this;
    vm.isActive = isActive;
    vm.isAuthenticated = isAuthenticated;
    vm.logout = logout;

    activate();

    ////////////////

    function activate() {
      vm.currentUser = $scope.currentUser;
    }

    function isActive(viewLocation) {
      return viewLocation === $location.path();
    }

    function isAuthenticated() {
      return $auth.isAuthenticated();
    }

    function logout() {
      $auth.logout();
      delete $window.localStorage.user;
      $location.path('/');
    }
  }
})();
