(function() {
  'use strict';

  angular
    .module('game')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('root', {
        url: '/git-gud',
        controller: 'MainController',
        templateUrl: 'app/components/map/map.html',
        resolve: {
          player: ensurePlayer
        }
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
