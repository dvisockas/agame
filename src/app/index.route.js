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
        controller: 'MainController',
        controllerAs: 'main',
        template: '<div class="container"><div ui-view></div></div>',
        resolve: {
          player: ensurePlayer
        }
      })
      .state('root.game', {
        url: '',
        templateUrl: 'app/components/map/map.html',
        controller: 'MapController'
      })
      .state('player', {
        url: '/git-gud',
        templateUrl: 'app/components/player/player.html',
        controller: 'PlayerController'
      })

    $urlRouterProvider.otherwise('/');
  }

  function ensurePlayer ($http, $q) {
    return $q.reject('dick');
  }

  function runFn ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function (_event, _toState, _toParams, _fromState, _fromParams, _error) {
      $state.go('player');
    });
  }

})();
