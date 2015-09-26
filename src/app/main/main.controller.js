(function() {
  'use strict';

  angular
    .module('game')
    .controller('MainController', MainController);

  /** @ngInject */
  MainController.$inject = ['$scope', 'player', 'Restangular', '$window', 'socket'];
  function MainController ($scope, player, Restangular, $window, socket) {
    $scope.player = player;

    socket.on('active users', function (users) {
      $scope.players = users;
    });

    socket.emit('login', $scope.player);

    var watcher = $window.navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000
    });

    function onSuccess (data) {
      var coords = data.coords,
          latitude = coords.latitude,
          longitude = coords.longitude,
          opts = { latitude: latitude, longitude: longitude },
          player = $scope.player;

      player.latitude = latitude;
      player.longitude = longitude;

      socket.emit('location changed', player);

      Restangular.one('players', player.id).patch({ player: opts });

      $scope.$broadcast('position-changed');
    }

    function onError () {
      $window.alert('No game for you');
    }
  }
})();
