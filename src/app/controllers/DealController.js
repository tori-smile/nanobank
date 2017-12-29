(function(){

  angular
    .module('app')
    .controller('DealController', ['$rootScope', '$state', '$stateParams', 'DealService', 'UserService',
      DealController
    ]);

  function DealController($rootScope, $state, $stateParams, DealService, UserService) {
    var vm = this;
    vm.deal = $rootScope.$stateParams.deal;
    vm.newDeal = true;
    vm.readonly = false;
    if (vm.deal != null){
      updateStartState();
      vm.newDeal = false;
      if (vm.deal.dealStartDate != null){
          vm.readonly = true;
      }
      vm.isCreditor = vm.deal.ownerUserName == UserService.currentUsername ? false:true;
    }
    vm.createDeal = createDeal;
    vm.updateDeal = updateDeal;
    vm.deleteDeal = deleteDeal;
    vm.change = change;

    function createDeal(){
      vm.deal.ownerUserName = UserService.currentUsername
      DealService.Create(vm.deal);
    }

    function updateDeal(){
      vm.dataLoading = true;
      DealService.Update(vm.deal).then(function(response){
        vm.dataLoading = false;
        updateStartState();
      });
    }

    function updateStartState(){
      vm.startDealState = {
        'title': vm.deal.title,
        'startAmount' : vm.deal.startAmount,
        'dealDurationInMonth': vm.deal.dealDurationInMonth,
        'percentRate': vm.deal.percentRate
      }
      vm.formChanged = false;
    }

    function deleteDeal(){
      vm.dataLoading = true;
      DealService.Delete(vm.deal.id).then(function(response){
        clearData();
        $state.go($state.current, {}, {reload: true});
      })
    }

    function clearData(){
      $rootScope.$stateParams.deal = null;
    }

    function change(){
      if (!vm.newDeal){
        if (allValuesAreOld()){
          vm.formChanged = false;
        }else {
          vm.formChanged = true;
        }
      }
    }

    function allValuesAreOld(){
      return vm.deal.title == vm.startDealState.title &&
             vm.deal.startAmount == vm.startDealState.startAmount &&
             vm.deal.dealDurationInMonth == vm.startDealState.dealDurationInMonth &&
             vm.deal.percentRate == vm.startDealState.percentRate;
    }

  }

})();
