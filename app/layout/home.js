(function() {
'use strict';

  angular
    .module('app.layout')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$auth'];
  function HomeController($scope, $auth) {
    var vm = this;

    vm.isAuthenticated = isAuthenticated;

    activate();

    ////////////////

    function activate() {
      
    }


    function isAuthenticated() {
      return $auth.isAuthenticated();
    }
  }
})();