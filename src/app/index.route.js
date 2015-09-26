(function() {
  'use strict';

  angular
    .module('game')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('root', {
        url: '/',
        absctract: true,
        controller: 'MainController',
        controllerAs: 'main',
        template: '<div class="container"><div ui-view></div></div>',
        resolve: {
          player: ensurePlayer
        }
      })
      .state('root.game', {
        url: '/git-gud',
        templateUrl: 'app/components/map/map.html',
        controller: 'MapController'
      })
      .state('player', {
        url: '/become',
        templateUrl: 'app/components/player/player.html',
        controller: 'PlayerController'
      })

    $urlRouterProvider.otherwise('/git-gud');
  }

  ensurePlayer.$inject = ['Restangular', '$q'];
  function ensurePlayer (Restangular, $q) {
    return $q.resolve('dick');
  }

})();
