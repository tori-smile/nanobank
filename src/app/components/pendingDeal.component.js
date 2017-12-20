(function() {
    'use strict';

    angular
        .module('app')
        .component('pendingDeal',{
          controller: pendingDealComponent,
          controllerAs: 'vm',
          templateUrl: 'app/views/partials/pendingDeal.html',
          bindings: {
            deal: '='
          }
        });

    function pendingDealComponent(){
      var vm = this;
      vm.hello= "hello";

      vm.$onInit = function(){
          console.log("im here", vm);
      }

    }
})();
