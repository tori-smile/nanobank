(function(){

  angular
    .module('app')
    .controller('UserDialogController', ['user', 'UserService', '$scope', '$state','$mdDialog', 'cardsService', 'helpService',
      UserDialogController
    ]);

  function UserDialogController(user, UserService, $scope, $state, $mdDialog, cardsService, helpService) {
    var vm = this;
    vm.user = user;
    vm.cards = cardsService.loadAll();
    vm.cards.forEach(function(card){
      if (card.value == vm.user.cardNumber){
        vm.user.cardNumber = card.display;
      };
    });

    vm.user.ratingPositive = helpService.formatRating(vm.user.ratingPositive, true);
    vm.user.ratingNegative = helpService.formatRating(vm.user.ratingNegative, false);

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };

    $scope.showConfirm = function(ev, forDeletion) {
      $mdDialog.show(getConfirmDialog(forDeletion)).then(function() {
        makeUserAction(forDeletion).then(function(response){
          $state.reload();
        });
      }, function() {
        // console.log('You decided to keep your debt.');
        // console.log(vm.user);
      });

      function getConfirmDialog(forDeletion){
        var title = forDeletion ? 'Вы действительно хотите удалить аккаунт данного пользователя?':'Вы действительно хотите утвердить аккаунт данного пользователя?'
        var textContent = forDeletion ? 'После подтверждения удаления учётная запись пользователя сотрётся из базы данных.' : 'После подтверждения действия пользователю предоставится доступ к ресурсам приложения.'
        var ok = forDeletion ? 'удалить.' : 'подтвердить.'

        var confirm = $mdDialog.confirm({
                      onComplete: function afterShowAnimation() {
                          var $dialog = angular.element(document.querySelector('md-dialog'));
                          var $actionsSection = $dialog.find('md-dialog-actions');
                          var $cancelButton = $actionsSection.children()[0];
                          var $confirmButton = $actionsSection.children()[1];
                          angular.element($confirmButton).addClass('md-raised md-accent');
                          angular.element($cancelButton).addClass('md-accent');
                      }
        })
              .title(title)
              .textContent(textContent)
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Да, ' + ok)
              .cancel('Отмена');

        return confirm;
      }

      function makeUserAction(deletion){
        if (deletion){
          return UserService.Delete(vm.user.userName);
        }else {
          return UserService.Approve(vm.user.userName);
        }
      }
    };
  }

})();
