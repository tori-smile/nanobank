'use strict';

angular.module('angularMaterialAdmin', ['ngAnimate', 'ngCookies',
  'ngSanitize', 'ui.router', 'ngMaterial', 'nvd3', 'app' , 'md.data.table'])

  .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider,
                    $mdIconProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/views/main.html',
        controller: 'MainController',
        controllerAs: 'vm',
        abstract: true
      })
      .state('home.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/views/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm',
        data: {
          title: 'Dashboard'
        },
        resolve:{
          deals: ['$http','$stateParams', function($http, $stateParams) {
            // console.log($stateParams); // comes through fine
            // var state = this;
            // console.log(state); // will give you a "raw" state object
            return $http({
              method: 'GET',
              url: 'http://nanobank.azurewebsites.net/api/deal/all'
            });
          }]
        }
      })
      .state('home.profile', {
        url: '/profile',
        templateUrl: 'app/views/profile.html',
        controller: 'ProfileController',
        controllerAs: 'vm',
        data: {
          title: 'Profile',
        },
        resolve:{
          user: ['$http','$stateParams', function($http, $stateParams) {
            // console.log($stateParams); // comes through fine
            // var state = this;
            // console.log(state); // will give you a "raw" state object
            return $http({
              method: 'GET',
              url: 'http://nanobank.azurewebsites.net/api/user/admin'
            });
          }]
        }
      })
      .state('home.table', {
        url: '/table',
        controller: 'TableController',
        controllerAs: 'vm',
        templateUrl: 'app/views/table.html',
        data: {
          title: 'Table'
        }
      })
      .state('home.data-table', {
        url: '/data-table',
        controller: 'DataTableController',
        controllerAs: 'vm',
        templateUrl: 'app/views/data-table.html',
        data: {
          title: 'Table'
        }
      })
      .state('homes', {
        url: '/',
        controller: 'HomeController',
        templateUrl: 'app/views/home.html',
        controllerAs: 'vm'
      })
      .state('login', {
        url: '/login',
        controller: 'LoginController',
        templateUrl: 'app/views/login.html',
        controllerAs: 'vm'
      })
      .state('register',{
        url: '/register',
        controller: 'RegisterController',
        templateUrl: 'app/views/register.html',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/login');

    $mdThemingProvider
      .theme('default')
        .primaryPalette('grey', {
          'default': '600'
        })
        .accentPalette('teal', {
          'default': '500'
        })
        .warnPalette('defaultPrimary');

    $mdThemingProvider.theme('dark', 'default')
      .primaryPalette('defaultPrimary')
      .dark();

    $mdThemingProvider.theme('grey', 'default')
      .primaryPalette('grey');

    $mdThemingProvider.theme('custom', 'default')
      .primaryPalette('defaultPrimary', {
        'hue-1': '50'
    });

    $mdThemingProvider.definePalette('defaultPrimary', {
      '50':  '#FFFFFF',
      '100': 'rgb(255, 198, 197)',
      '200': '#E75753',
      '300': '#E75753',
      '400': '#E75753',
      '500': '#E75753',
      '600': '#E75753',
      '700': '#E75753',
      '800': '#E75753',
      '900': '#E75753',
      'A100': '#E75753',
      'A200': '#E75753',
      'A400': '#E75753',
      'A700': '#E75753'
    });

    $mdIconProvider.icon('user', 'assets/images/user.svg', 64);
  })
  .run(function ($rootScope, $location, $cookieStore, $http){
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
        var loggedIn = $rootScope.globals.currentUser;
        if (restrictedPage && !loggedIn) {
            //$location.path('/login');
        }
    });
  })
  ;
