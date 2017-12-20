(function(){

  angular
    .module('app')
    .controller('DashboardController', ['deals',
      DashboardController
    ]);

  function DashboardController(deals) {
    var vm = this;
    vm.deals = deals.data;
    console.log("DashboardController", vm.deals);

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
