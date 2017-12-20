(function(){

  angular
    .module('app')
    .controller('ProfileController', ['user',
      ProfileController
    ]);

  function ProfileController(user) {
    var vm = this;

    vm.user = user.data;
    vm.user.phoneNumber = '+' + vm.user.phoneNumber;
    //
    // vm.user = {
    //   title: 'Admin',
    //   email: 'contact@flatlogic.com',
    //   firstName: '',
    //   lastName: '' ,
    //   company: 'FlatLogic Inc.' ,
    //   address: 'Fabritsiusa str, 4' ,
    //   city: 'Minsk' ,
    //   state: '' ,
    //   biography: 'We are young and ambitious full service design and technology company. ' +
    //   'Our focus is JavaScript development and User Interface design.',
    //   postalCode : '220007'
    // };
  }

})();
