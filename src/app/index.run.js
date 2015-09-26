(function() {
  'use strict';

  angular
    .module('game')
    .run(runFn);

  /** @ngInject */
  runFn.$inject = ['$rootScope', '$state'];
  function runFn ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function () {
      $state.go('player');
    });
  }

})();
