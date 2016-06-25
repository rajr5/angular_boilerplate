angular.module('app.services')
  .factory('Account', function($http) {
    return {
      updateProfile: function(data) {
        return $http.put('/api/account', data);
      },
      changePassword: function(data) {
        return $http.put('/api/account', data);
      },
      deleteAccount: function() {
        return $http.delete('/api/account');
      },
      forgotPassword: function(data) {
        return $http.post('/api/forgot', data);
      },
      resetPassword: function(token, data) {
        return $http.post('/api/reset/'+token, data);
      },
      activateAccount: function(token, data) {
        return $http.post('/api/activate/'+token, data);
      },
      getUsers: function(data) {
        return $http.get('/api/users', data);
      }
    };
  });