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
      var coords = data.coords,
          latitude = coords.latitude,
          longitude = coords.longitude,
          opts = { latitude: latitude, longitude: longitude };

      $scope.player.latitude = latitude;
      $scope.player.longitude = longitude;

      socket.emit('location changed', $scope.player);

      if (!$scope.players && !$scope.buildings) {
        Restangular.one('game').get(opts).then(function (data) {
          $scope.players = data.players;
          $scope.buildings = data.estates;
          socket.on('location changed', function(data) {
            console.log(data);
          });
        });
      }

      Restangular.one('player', $scope.player.id).patch({ player: opts });

      $scope.$broadcast('position-changed');
    }

    function onError () {
      $window.alert('No game for you');
    }
  }
})();
