(function(){

  angular
    .module('app')
    .controller('DealController', ['$rootScope', '$state', '$stateParams', 'DealService', 'UserService', 'helpService','$q', '$mdDialog',
      DealController
    ]);

  function DealController($rootScope, $state, $stateParams, DealService, UserService, helpService, $q, $mdDialog) {
    var vm = this;
    vm.deal = $rootScope.$stateParams.deal;
    vm.newDeal = true;
    vm.isAlreadyStarted = false;
    vm.isClosed = false;
    vm.confirmPositiveRating = confirmPositiveRating;
    vm.confirmPositiveReset = confirmPositiveReset;
    vm.confirmNegativeRating = confirmNegativeRating;
    vm.confirmNegativeReset = confirmNegativeReset;
    vm.closeDeal = closeDeal;

    if (vm.deal != null){
      console.log(vm.deal);
      updateStartState();
      defineRating();
      vm.newDeal = false;
      if (vm.deal.dealStartDate != null){
          vm.isAlreadyStarted = true;
      }
      if (vm.deal.dealClosedDate != null){
          vm.isClosed = true;
      }
      vm.isCreditor = vm.deal.ownerUserName == UserService.currentUsername ? false:true;
    }
    vm.createDeal = createDeal;
    vm.updateDeal = updateDeal;
    vm.deleteDeal = deleteDeal;
    vm.change = change;

    function defineRating(){
      vm.ratingPositive = vm.deal.ratingPositive ? vm.deal.ratingPositive : 0;
      vm.ratingNegative = vm.deal.ratingNegative ? vm.deal.ratingNegative : 0;
    }

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

    function closeDeal(){
      var title = "Вы действительно хотите закрыть сделку?"
      var textContent = 'После подтверждения действия заёмщик не сможет Вам больше перевести деньги.';
      var ok = 'закрыть'
      $mdDialog.show(helpService.getConfirmDialog(title, textContent, ok)).then(function() {
        console.log('закрыть');
        DealService.CloseDeal(vm.deal.id, UserService.currentUsername).then(function(response){
          clearData();
          $state.go($state.current, {}, {reload: true});
        })
      }, function() {
        //d.reject();
      });
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

    function confirmPositiveReset(rating){
      console.log('reset', rating);
      var d = $q.defer();
      var title = "Вы действительно хотите убрать положительную оценку?"
      var textContent = '';
      var ok = 'убрать'
      $mdDialog.show(helpService.getConfirmDialog(title, textContent, ok)).then(function() {
        setRating(vm.ratingNegative, 0);
        d.resolve();
      }, function() {
        //d.reject();
      });
      return d.promise;
    }

    function confirmNegativeReset(rating){
      console.log('reset', rating);
      var d = $q.defer();
      var title = "Вы действительно хотите убрать негативную оценку?"
      var textContent = '';
      var ok = 'убрать'
      $mdDialog.show(helpService.getConfirmDialog(title, textContent, ok)).then(function() {
        setRating(0, vm.ratingPositive);
        d.resolve();
      }, function() {
        //d.reject();
      });
      return d.promise;
    }

    function confirmPositiveRating(rating, value){
      console.log('rating', rating);
      var d = $q.defer();
      var title = "Вы действительно хотите поставить пользователю положительную оценку?"
      var textContent = '';
      var ok = 'поставить'
      $mdDialog.show(helpService.getConfirmDialog(title, textContent, ok)).then(function() {
        // console.log('rating positive', rating);
        // console.log('rating negative', vm.ratingNegative);
        setRating(vm.ratingNegative, rating);
        d.resolve();
      }, function() {
        //d.reject();
      });
      return d.promise;
    }

    function confirmNegativeRating(rating, value){
      console.log('rating', rating);
      var d = $q.defer();
      var title = "Вы действительно хотите поставить пользователю негативную оценку?"
      var textContent = '';
      var ok = 'поставить'
      $mdDialog.show(helpService.getConfirmDialog(title, textContent, ok)).then(function() {
        // console.log('rating positive', rating);
        // console.log('rating negative', vm.ratingNegative);
        setRating(rating, vm.ratingPositive);
        d.resolve();
      }, function() {
        //d.reject();
      });
      return d.promise;
    }

    function setRating(negative, positive){
      var ratingData = {
        'creditorUsername': UserService.currentUsername,
        'positive': positive,
        'negative': negative
      }
      DealService.SetRating(vm.deal.id, ratingData).then(function(result){
        console.log('set rating result', result);
      })
    }

  }

})();
