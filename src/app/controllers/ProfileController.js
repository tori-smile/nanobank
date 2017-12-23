(function(){

  angular
    .module('app')
    .controller('ProfileController', ['UserService', 'helpService', '$timeout',
      ProfileController
    ]);

  function ProfileController(UserService, helpService, $timeout) {
    var vm = this;

    waitForCurrentUser();

    function waitForCurrentUser(){
      $timeout(function() {
        vm.user = UserService.currentUser;
        vm.user.phoneNumber = helpService.formatPhoneNumber(vm.user.phoneNumber)
        if (angular.isUndefined(vm.user.firstName)){
          waitForCurrentUser()
        };
      }, 500);
    }
  }

})();
