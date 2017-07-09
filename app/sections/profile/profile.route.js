(function(){
  'use strict';

  angular.module('sections.profile')
  .run(configRoutes);
    
  /* @ngInject */
  function configRoutes($stateProvider){

    $stateProvider.state('app.profile', {
        url: '/profile',
        controller:'ProfileController',
        controllerAs: 'vm',
        bindToController: true,
        cache: false,
        templateUrl: 'sections/profile/profile.html',
        resolve: {
            loginRequired: loginRequired,
        },
        ncyBreadcrumb: {
            label: 'Profile',
            parent: 'landing'
        }
    });
  }
})();