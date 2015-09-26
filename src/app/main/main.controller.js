(function() {
  'use strict';

  angular
    .module('game')
    .controller('MainController', MainController);

  /** @ngInject */
  MainController.$inject = ['$scope', 'player']
  function MainController ($scope, player) {
    $scope.player = player;
  }
})();
