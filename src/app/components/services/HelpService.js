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
    service.formatDatePeriod = formatDatePeriod;

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

    function formatDatePeriod(monthesCount){
      var answer = '';
      var monthes = [1, 6, 12, 18];
      var inWords = ['месяц','полгода', 'год', 'полтора года']

      if (monthes.indexOf(monthesCount) != -1){
        answer = inWords[monthes.indexOf(monthesCount)];
      }else if (monthesCount % 10 == 1) {
        answer = monthesCount + ' месяц';
      }else if ([2,3,4].indexOf(monthesCount % 10)!=-1 && (monthesCount<10 || monthesCount>20)) {
        answer = monthesCount + ' месяца';
      }else {
        answer = monthesCount + ' месяцев';
      }

      return answer;
    }

    return service;
  }

})();
