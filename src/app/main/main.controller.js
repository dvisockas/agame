(function() {
  'use strict';

  angular
    .module('game')
    .controller('MainController', MainController);

  /** @ngInject */
  MainController.$inject = ['$scope', 'player', 'Restangular', '$window', 'socket'];
  function MainController ($scope, player, Restangular, $window, socket) {
    $scope.player = player;

    var watcher = $window.navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000
    });

    function onSuccess (data) {
      var coords = data.coords;

      $scope.player.latitude = coords.latitude;
      $scope.player.longitude = coords.longitude;

      socket.emit('location changed', $scope.player);

      if (!$scope.players && !$scope.buildings) {
        Restangular.one('game').get({ latitude: $scope.player.latitude, longitude: $scope.player.longitude }).then(function (data) {
          $scope.players = data.players;
          $scope.buildings = data.estates;
          socket.on('location changed', function(data) {
            debugger;
          });
        });
      }

      Restangular.one('player', $scope.player.id).patch();

      $scope.$broadcast('position-changed');
    }

    function onError () {
      $window.alert('No game for you');
    }
  }
})();
