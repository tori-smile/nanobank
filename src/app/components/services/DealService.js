(function () {
    'use strict';

    angular
        .module('app')
        .factory('DealService', DealService);

    DealService.$inject = ['$http', '$httpParamSerializerJQLike', '$state'];
    function DealService($http, $httpParamSerializerJQLike, $state) {
        var service = {};
        var API_BASE = 'http://nanobank.azurewebsites.net'
        var specialContentType = {headers: {'Content-Type': 'application/x-www-form-urlencoded'}};

        service.GetAll = GetAll;
        service.GetAllOpen = GetAllOpen;
        service.GetAllUserDeals = GetAllUserDeals;
        service.Create = Create;
        service.Update = Update;
        service.Response = Response;
        service.Delete = Delete;
        service.SetRating = SetRating;
        service.CloseDeal = CloseDeal;
        return service;

        function GetAll() {
            return $http.get(API_BASE + '/api/deal/all').then(handleSuccess, handleError('Error getting all deals'));
        }

        function GetAllOpen() {
            return $http.get(API_BASE + '/api/deal/all/opened').then(handleSuccess, handleError('Error getting all opened deals'));
        }

        function GetAllUserDeals(username) {
            return $http.get(API_BASE + '/api/deal/' + username + '/all').then(handleSuccess, handleError('Error getting all deals'));
        }

        function Create(deal) {
          return $http.post(API_BASE + '/api/deal/register', processData(deal), specialContentType).then(handleSuccess, handleError('Error creating deal'));
        }

        function Update(deal) {
          return $http.put(API_BASE + '/api/deal/' + deal.id, deal).then(handleSuccess, handleError('Error updating deal'));
        }

        function Response(dealId, username) {
          console.log(username);
            return $http.put(API_BASE + '/api/deal/respond/' + dealId, JSON.stringify(username)).then(handleSuccess, handleError('Error resposing deal'));
        }

        function Delete(dealid) {
          // application/x-www-form-urlencoded
            return $http.delete(API_BASE + '/api/deal/' + dealid, '', specialContentType).then(handleSuccess, handleError('Error deleting deal'));
        }

        function SetRating(dealId, ratingData){
          return $http.put(API_BASE + '/api/deal/' + dealId + '/set/rating', ratingData).then(handleSuccess, handleError('Error setting rating to deal'));
        }

        function CloseDeal(dealId, creditorUsername){
          return $http.put(API_BASE + '/api/deal/close/' + dealId, JSON.stringify(creditorUsername)).then(handleSuccess, handleError('Error closing deal'));
        }
        // private functions

        function processData(data){
          return $httpParamSerializerJQLike(data);
        }

        function handleSuccess(res) {
            console.log(res.data);
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
