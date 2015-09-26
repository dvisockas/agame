angular.module('game')
  .directive('map', ['$window', '$rootScope', function ($window, $rootScope) {
    return {
      scope: {
        player: '=',
        players: '=',
        buildings: '='
      }, // {} = isolate, true = child, false/undefined = no change
      restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
      link: function ($scope, $elem, attrs) {
        function onClick(e) {$rootScope.$broadcast('clickedMarker', e.target.options.player || e.target.options.estate)};

        function clickedMarker(user) {

        };
        var layer = new L.stamenTileLayer('toner'),
            map = new L.Map(attrs.id, {
              center: [$scope.player.latitude, $scope.player.longitude],
              zoom: 1
            }),
            playerMarkers = {},
            buildingMarkers = {},
            playerMarker;

        map.addLayer(layer);

        var playerWatcher = $scope.$watch('players', function (playas) {
          if (playas) {
            angular.forEach(playas, function (playa) {
              var coords = [playa.latitude, playa.longitude]

              playerMarkers[playa.id] = L.marker(coords, {icon: peasantIcon, player: playa}).addTo(map).on('click', onClick);
            });

            playerWatcher();
          }
        });

        var buildingsWatcher = $scope.$watch('buildings', function (buildings) {
          if (buildings) {
            angular.forEach(buildings, function (building) {
              var coords = [building.latitude, building.longitude];

              buildingMarkers[building.id] = L.marker(coords, {icon: buildingIcon, estate: building}).addTo(map).on('click', onClick);
            });

            buildingsWatcher();
          }
        });

        $scope.$on('position-changed', changeHandler);
        $scope.$on('user-moved', moveHandler);
        $scope.$on('user-joined', joinHandler);
        $scope.$on('user-left', leaveHandler);

        var playerIcon = L.icon({
          iconUrl: 'assets/images/angular.png',
          iconSize:     [75, 75], // size of the icon
          iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
          shadowAnchor: [4, 62],  // the same for the shadow
          popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        var peasantIcon = L.icon({
          iconUrl: 'assets/images/yeoman.png',
          iconSize:     [40, 40], // size of the icon
          iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
          shadowAnchor: [4, 62],  // the same for the shadow
          popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        var buildingIcon = L.icon({
          iconUrl: 'assets/images/jasmine.png',
          iconSize:     [40, 40], // size of the icon
          iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
          shadowAnchor: [4, 62],  // the same for the shadow
          popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        function changeHandler () {
          var coords = [$scope.player.latitude, $scope.player.longitude];

          // function onClick(e) {debugger;alert(this.getLatLng());};

          if (playerMarker) {
            playerMarker.setLatLng(coords);
          } else {
            playerMarker = L.marker(coords, {
              icon: playerIcon,
              zIndexOffset: 1000,
              player: $scope.player
            }).addTo(map);
          }

          map.setView(coords, 18, {
            animate: true
          });
        }

        function moveHandler (event, user) {
          angular.forEach(playerMarkers, function (id, marker) {
            if (user.id === id) {
              marker.setLatLng([user.latitude, user.longitude]);
            }
          });
        }

        function joinHandler (event, data) {
          var user = data.user;

          $scope.players.push(user);
          playerMarkers[user.id] = L.marker([user.latitude, user.longitude], {icon: peasantIcon, player: user}).on('click', onClick);
        }

        function leaveHandler (event, data) {
          var user = data.user,
              index = $scope.players.indexOf(user);

          $scope.players.splice(index, 1);
          delete playerMarkers[user.id];
        }
      }
    };

  }]);
