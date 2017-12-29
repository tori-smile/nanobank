(function(){

  angular
    .module('app')
    .controller('RequestsController', ['$scope', 'DealService', '$mdDialog', 'helpService',
      RequestsController
    ]);

  function RequestsController($scope, DealService, $mdDialog, helpService) {
    var vm = this;
    vm.activated = false;
    vm.tableData = [];
    DealService.GetAll().then(function(resourse){
      vm.tableData = resourse;
      vm.activated = true;
      console.log(vm.tableData);
    });
    $scope.customFilter = customFilter;
    vm.search = "";
    vm.showOpened = true;
    vm.showAssigned = true;
    vm.showUnassigned = true;
    vm.showClosed = true;

    $scope.showAdvanced = function(ev, data) {
       $mdDialog.show({
         locals:{user: data},
         controller: 'UserDialogController',
         templateUrl: 'app/views/partials/userDialog.html',
         parent: angular.element(document.body),
         controllerAs: 'vm',
         theme:"custom",
         targetEvent: ev,
         clickOutsideToClose:true,
         fullscreen: false
       })
       .then(function(answer) {
         $scope.status = 'You said the information was "' + answer + '".';
         console.log($scope.status);
       }, function() {
         $scope.status = 'You cancelled the dialog.';
         console.log($scope.status);
       });
     };

    function customFilter(deal){
      var assigned = angular.isDefined(deal.creditorUserName) && deal.creditorUserName !== null;
      console.log(deal, assigned);
      var ok = vm.showOpened && !deal.isClosed || vm.showClosed && deal.isClosed;

      return vm.showUnassigned && !assigned ||
             vm.showAssigned && assigned && ok;
    }
  }

})();
