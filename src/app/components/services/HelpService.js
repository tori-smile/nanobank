(function(){
  'use strict';

  angular.module('app')
          .service('helpService', [
          helpService
  ]);

  function helpService(){
    var service = {};

    service.formatPhoneNumber = formatPhoneNumber;
    service.formatRating = formatRating;

    function formatPhoneNumber(phoneNumber){
      var match = /^(\+?375|80)?(29|25|44|33)(\d{3})(\d{2})(\d{2})$/.exec(phoneNumber);
      if (angular.isDefined(match) && match != null){
        return '+375' + match.slice(2).join('') ;
      }else {
          return phoneNumber;
      }
    };

    function formatRating(rating, isPositive){
      var match = /^[\-\+]?(\d+)$/.exec(rating);
      var sign = isPositive ? "+":"-";
      if (angular.isUndefined(match) || match == null){
        match = [0,0];
      }
      return sign + match[1];
    }

    return service;
  }

})();
