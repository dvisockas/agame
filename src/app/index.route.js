(function() {
  'use strict';

  angular
    .module('game')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('game', {
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
    var name = localStorageService.get('player-name');
    
    if (name) {
      var parts = name.split('-');

      return Restangular.one('players', parts[parts.length - 1]);
    } else {
      return $q.reject(name);
    }
  }

})();
