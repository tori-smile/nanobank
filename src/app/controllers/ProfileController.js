(function(){

  angular
    .module('app')
    .controller('ProfileController', ['UserService',
      ProfileController
    ]);

  function ProfileController(UserService) {
    var vm = this;

    vm.user = UserService.currentUser;
    var match = /^(\+?375|80)?(29|25|44|33)(\d{3})(\d{2})(\d{2})$/.exec(vm.user.phoneNumber);
    vm.user.phoneNumber = '+375' + match.slice(2).join('');
  }

})();
