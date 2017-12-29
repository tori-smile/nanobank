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

    pendingDealComponent.$inject = ['$state','UserService', 'DealService', 'helpService','$mdDialog'];
    function pendingDealComponent($state, UserService, DealService, helpService, $mdDialog){
      var vm = this;
      vm.dataLoading=false;

      vm.$onInit = function(){
        vm.showButton = vm.deal.ownerUserName !== UserService.currentUsername;
      }

      vm.showConfirm = function(forDeletion) {
        var title = forDeletion ? 'Вы действительно хотите удалить данную заявку?':'Вы действительно хотите откликнуться на данную заявку?';
        var textContent = forDeletion ? 'После подтверждения удаления данная заявка окажется недоступной для Вас и других пользователей.' : 'Подтверждение действия означает согласие на условия заёмщика.';
        var ok = forDeletion ? 'удалить' : 'откликнуться';

        $mdDialog.show(helpService.getConfirmDialog(title, textContent, ok)).then(function() {
          makeDealAction(forDeletion).then(function(response){
            $state.reload();
            vm.dataLoading = false;
          });
        }, function() {
          // console.log('You decided to keep your debt.');
          // console.log(vm.user);
        });

        function makeDealAction(deletion){
          if (deletion){
            vm.dataLoading=true;
            return DealService.Delete(vm.deal.id);
          }else {
            console.log(vm.deal.id, UserService.currentUsername);
            return DealService.Response(vm.deal.id, UserService.currentUsername);
          }
        }
      };

    }
})();
