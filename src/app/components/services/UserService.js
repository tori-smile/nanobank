(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', '$httpParamSerializerJQLike'];
    function UserService($http, $httpParamSerializerJQLike) {
        var service = {};
        var API_BASE = 'http://nanobank.azurewebsites.net'

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.Login = Login;

        return service;

        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Create(user) {
          console.log(user);
            return $http.post(API_BASE + '/api/account/register', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        function Login(username, password){
          var loginInfo = {
            'grant_type': 'password',
            'username': username,
            'password': password
          }
          console.log('loginInfo', loginInfo);
          return $http({
            method: 'POST',
            url: API_BASE + '/api/token',
            data:  $httpParamSerializerJQLike(loginInfo),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).then(handleSuccess, handleError('Error logging in user'))
        }
        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
