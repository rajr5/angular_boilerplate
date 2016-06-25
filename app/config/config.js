(function(){
  'use strict';

  angular.module('app.config')
    .config(function($logProvider, $compileProvider, $routeProvider, $locationProvider, $authProvider, ENV) {
      // turn debugging off/on (no info or warn)
      if (ENV === 'development' || ENV === 'test') {
          $logProvider.debugEnabled(true);
          $compileProvider.debugInfoEnabled(true);
          console.log('env', ENV);
      } else {
          $logProvider.debugEnabled(false);
          $compileProvider.debugInfoEnabled(false);
      }

      $locationProvider.html5Mode(true);

      $routeProvider
        .when('/', {
          templateUrl: 'layout/home.html',
          controller: 'HomeController',
          controllerAs: 'vm',
        })
        .when('/login', {
          templateUrl: 'auth/login.html',
          controller: 'LoginController',
          controllerAs: 'vm',
          resolve: { skipIfAuthenticated: skipIfAuthenticated }
        })
        .when('/signup', {
          templateUrl: 'auth/signup.html',
          controller: 'SignupController',
          controllerAs: 'vm',
          resolve: { skipIfAuthenticated: skipIfAuthenticated }
        })
        .when('/forgot', {
          templateUrl: 'auth/forgot.html',
          controller: 'ForgotController',
          controllerAs: 'vm',
          resolve: { skipIfAuthenticated: skipIfAuthenticated }
        })
        .when('/reset', {
          templateUrl: 'auth/reset.html',
          controller: 'ResetController',
          controllerAs: 'vm',
          resolve: { skipIfAuthenticated: skipIfAuthenticated }
        })
        .when('/activate', {
          templateUrl: 'auth/activate.html',
          controller: 'ActivateController',
          controllerAs: 'vm',
          resolve: { skipIfAuthenticated: skipIfAuthenticated }
        })
        .when('/account', {
          templateUrl: 'user/profile.html',
          controller: 'ProfileController',
          controllerAs: 'vm',
          resolve: { loginRequired: loginRequired }
        })
        .otherwise({
          templateUrl: 'layout/404.html'
        });

      $authProvider.tokenPrefix = 'myapp';
      $authProvider.loginUrl = '/api/login';
      $authProvider.signupUrl = '/api/signup';

      function skipIfAuthenticated($location, $auth) {
        if ($auth.isAuthenticated()) {
          $location.path('/');
        }
      }

      function loginRequired($location, $auth) {
        if (!$auth.isAuthenticated()) {
          $location.path('/login');
        }
      }
    })
    .run(function($rootScope, $window) {
      if ($window.localStorage.user) {
        $rootScope.currentUser = JSON.parse($window.localStorage.user);
      }
  });
})();