(function(){
  'use strict';

  angular.module('app')
          .service('navService', [
          '$q',
          navService
  ]);

  function navService($q){
    var menuItems = [
      {
        name: 'Список заявок',
        icon: 'dashboard',
        sref: '.dashboard'
      },
      {
        name: 'Мои сделки',
        icon: 'view_module',
        sref: '.table'
      },
      {
        name: 'Личный кабинет',
        icon: 'person',
        sref: '.profile'
      },
      {
        name: 'Оформить заявку',
        icon: 'create',
        sref: '.data-table'
      },
      {
        name: 'Пользователи',
        icon: 'person',
        sref: '.users'
      }
    ];

    return {
      loadAllItems : function() {
        return $q.when(menuItems);
      }
    };
  }

})();
