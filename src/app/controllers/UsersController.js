(function(){

  angular
    .module('app')
    .controller('UsersController', ['$scope', 'UserService',
      UsersController
    ]);

  function UsersController($scope, UserService) {
    var vm = this;
    vm.activated = false;
    UserService.GetAll().then(function(resourse){
      vm.tableData = resourse;
      console.log('table data', vm.tableData);
      vm.activated = true;
    });
    $scope.customFilter = customFilter;
    vm.search = "";
    vm.showApproved = true;
    vm.showUnapproved = true;

    function customFilter(user){
      return vm.showApproved && user.isApproved || vm.showUnapproved && !user.isApproved;
    }
  }

})();
