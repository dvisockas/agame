(function() {
  'use strict';

  angular
    .module('game')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
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
      });

    $urlRouterProvider.otherwise('/git-gud');
  }

  ensurePlayer.$inject = ['Restangular', 'localStorageService', '$q'];
  function ensurePlayer (Restangular, localStorageService, $q) {
    var playerId = localStorageService.get('player-id');
    
    if (playerId) {
      return Restangular.one('players', playerId);
    } else {
      return $q.reject(playerId);
    }
  }

})();
