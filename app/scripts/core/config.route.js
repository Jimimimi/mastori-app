'use strict';

angular.module('app')
.run(
  ['$rootScope', '$state', '$stateParams', '$location', '$uibModal',
    function ($rootScope,   $state,   $stateParams, $location, $uibModal) {
        $rootScope.$on('$stateChangeStart', function stateChangeStart(event, toState) {
          });
          var history = [];
          $rootScope.$on('$stateChangeSuccess', function() {
              history.push($location.$$path);
          });
          $rootScope.back = function () {
              var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
              $location.path(prevUrl);
          }

          $rootScope.openModal = function (size, template, data) {
              var modalInstance = $uibModal.open({
                  animation: true,
                  templateUrl:  template,
                  controller: 'ModalInstanceCtrl',
                  size: size,
                  resolve: {
                      data: function () {
                          return data;
                      }
                  }
              });
              modalInstance.result.then(function (selectedItem) {
                }, function () {
                });
          };
    }
  ]
)

.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
        var main_layout = "views/layouts/main.html";
        $stateProvider
            .state('app', {
                abstract: true,
                url: '/app',
                templateUrl: main_layout
            })
            .state('app.home', {
                url: '/home',
                templateUrl: 'views/home.html',
                controller:'HomeCtrl',
                ncyBreadcrumb: {
                  label: 'Home'
                }
            })
            .state('app.mastoria', {
                url: '/mastoria?order&orderby&only_offers&{profession[]:int}&{area[]:int}&near&q&{userlocation}',
                reloadOnSearch : false,
                templateUrl: 'views/mastoria/list.html',
                controller:'MastoriaCtrl',
                ncyBreadcrumb: {
                  label: 'Mastoria',
                  parent: 'app.home'
                }
            })
            .state('app.mastori', {
                url: '/mastoria/:id',
                templateUrl: 'views/mastoria/one.html',
                controller:'MastoriCtrl',
                ncyBreadcrumb: {
                  label: '{{ ::mastori.last_name }} {{ ::mastori.first_name }}',
                  parent: 'app.mastoria'

                }
            })
            .state('app.signup', {
                url: '/signup',
                templateUrl: 'views/user/signup.html',
            })
            .state('app.signin', {
                url: '/signin',
                templateUrl: 'views/user/signin.html',
            })
            .state('app.profile', {
                url: '/profile',
                templateUrl: 'views/user/profile.html',
            })
            .state('app.forgot-password', {
                url: '/forgot-password',
                templateUrl: 'views/user/forgot-password.html',
            })
            .state('app.404', {
                url: '/404',
                templateUrl: 'views/pages/404.html',
            })
            .state('app.500', {
                url: '/500',
                templateUrl: 'views/pages/500.html',
            })
            .state('app.blank', {
                url: '/blank',
                templateUrl: 'views/pages/blank.html',
            })
            .state('landing', {
                url: '/',
                templateUrl: 'views/pages/landing.html',
                controller:'LandingCtrl'
            })

             $urlRouterProvider
                .otherwise('/');
      }
    ]
  );
