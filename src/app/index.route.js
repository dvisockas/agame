(function() {
  'use strict';

  angular
    .module('game')
    .config(routeConfig)
    .run(runFn);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('root', {
        url: '/',
        absctract: true,
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main',
        resolve: {
          player: ensurePlayer
        }
      })
      .state('root.game', {
        url: '',
        templateUrl: 'app/components/map.html',
        controller: 'MapController'
      })
      .state('player', {
        url: '/git-gud',
        templateUrl: 'app/components/player.html',
        controller: 'PlayerController'
      })

    $urlRouterProvider.otherwise('/');
  }

  function ensurePlayer ($http) {
    
  }

  function runFn ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function (_event, _toState, _toParams, _fromState, _fromParams, _error) {
      $state.go('player');
    });
  }

})();
