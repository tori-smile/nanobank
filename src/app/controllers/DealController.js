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
    vm.complainAboutDeal = complainAboutDeal;

    if (vm.deal != null){
      console.log(vm.deal);
      updateStartState();
      defineRating();
      defineIsOverdue();
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

    function defineIsOverdue(){
      vm.amountToReturn = vm.deal.startAmount * (1 + vm.deal.percentRate/100.0);
      vm.amountToReturnPerMonth = vm.amountToReturn / vm.deal.dealDurationInMonth;
      vm.monthesPassed = Math.trunc(Math.abs(moment().diff(moment(vm.deal.startDealState), 'months', true)));
      vm.amountMustBeAlreadyReturned = vm.amountToReturnPerMonth * vm.monthesPassed;
      vm.isOverdue = vm.amountMustBeAlreadyReturned > vm.deal.returnedAmount;
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
        DealService.Close(vm.deal.id, UserService.currentUsername).then(function(response){
          clearData();
          $state.go($state.current, {}, {reload: true});
        })
      }, function() {
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
      var d = $q.defer();
      var title = "Вы действительно хотите убрать положительную оценку?"
      var textContent = '';
      var ok = 'убрать'
      $mdDialog.show(helpService.getConfirmDialog(title, textContent, ok)).then(function() {
        setRating(vm.ratingNegative, 0);
        d.resolve();
      }, function() {
      });
      return d.promise;
    }

    function confirmNegativeReset(rating){
      var d = $q.defer();
      var title = "Вы действительно хотите убрать негативную оценку?"
      var textContent = '';
      var ok = 'убрать'
      $mdDialog.show(helpService.getConfirmDialog(title, textContent, ok)).then(function() {
        setRating(0, vm.ratingPositive);
        d.resolve();
      }, function() {
      });
      return d.promise;
    }

    function confirmPositiveRating(rating, value){
      var d = $q.defer();
      var title = "Вы действительно хотите поставить пользователю положительную оценку?"
      var textContent = '';
      var ok = 'поставить'
      $mdDialog.show(helpService.getConfirmDialog(title, textContent, ok)).then(function() {
        setRating(vm.ratingNegative, rating);
        d.resolve();
      }, function() {
      });
      return d.promise;
    }

    function confirmNegativeRating(rating, value){
      var d = $q.defer();
      var title = "Вы действительно хотите поставить пользователю негативную оценку?"
      var textContent = '';
      var ok = 'поставить'
      $mdDialog.show(helpService.getConfirmDialog(title, textContent, ok)).then(function() {
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
      DealService.SetRating(vm.deal.id, ratingData);
    }

    function complainAboutDeal(ev) {
      // App ending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.prompt({
                    onComplete: function afterShowAnimation() {
                        var $dialog = angular.element(document.querySelector('md-dialog'));
                        var $actionsSection = $dialog.find('md-dialog-actions');
                        var $cancelButton = $actionsSection.children()[0];
                        var $confirmButton = $actionsSection.children()[1];
                        angular.element($confirmButton).addClass('md-raised md-accent md-warn');
                        angular.element($cancelButton).addClass('md-accent md-warn');
                    }
      })
        .title('Пожаловаться')
        .textContent('Заёмщик не выплачивает вовремя?')
        .placeholder('Опишите Вашу ситуацию')
        .ariaLabel('Dog name')
        .initialValue('')
        .targetEvent(ev)
        .required(true)
        .ok('пожаловаться')
        .cancel('отмена');

      $mdDialog.show(confirm).then(function(result) {
        console.log(result);
        var complainData = {
          'DealId': vm.deal.id,
          'ComplainText': result,
          'Username': UserService.currentUsername
        }
        DealService.Complain(complainData).then(function(result){
          console.log('finished complain');
        })
      }, function() {

      });
    };

  }

})();
