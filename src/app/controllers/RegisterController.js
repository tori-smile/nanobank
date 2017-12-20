(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'FlashService', 'cardsService'];
    function RegisterController(UserService, $location, $rootScope, FlashService, cardsService) {
        var vm = this;

        vm.cards = cardsService.loadAll();
        vm.selectedCards = null;
        vm.searchText = null;
        // vm.querySearch = querySearch;
        vm.disableCaching = true;

        vm.register = register;

        function register() {
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
    }

})();
