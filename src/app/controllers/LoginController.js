(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', 'AuthenticationService', 'FlashService', 'UserService'];
    function LoginController($state, AuthenticationService, FlashService, UserService) {
        var vm = this;

        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password, response);
                    putInformationToUserServiceAndGo(vm.username)
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        };

        function putInformationToUserServiceAndGo(username){
          UserService.GetByUsername(username).then(
            function (response){
              UserService.currentUser = response;
              $state.go("home.dashboard");
            },
            function (error){});
        }
    }

})();
