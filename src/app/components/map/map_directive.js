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

        function distance(lat1, lon1, lat2, lon2) {
        	var radlat1 = Math.PI * lat1/180
        	var radlat2 = Math.PI * lat2/180
        	var radlon1 = Math.PI * lon1/180
        	var radlon2 = Math.PI * lon2/180
        	var theta = lon1-lon2
        	var radtheta = Math.PI * theta/180
        	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        	dist = Math.acos(dist)
        	dist = dist * 180/Math.PI
        	dist = dist * 60 * 1.1515
        	dist = dist * 1.609344
        	return dist
        }

        function onClick(e) {
          var obj;
          // this.originalIconSrc = this._icon.src;
          //
          // this._icon.src = 'https://scontent-frt3-1.xx.fbcdn.net/hprofile-xtp1/v/t1.0-1/c0.0.40.40/p40x40/1979708_10201712618802816_1524137007_n.jpg?oh=e7ef9cc3dca96f21be3c5b02e28b531f&oe=568E37A3';
          if (this.getLatLng) {
            obj = this.getLatLng();
          } else {
            obj = {};
          }

          if (($scope.players.length || $scope.estates.length) && obj.lat) {
            var nearby = [];
            angular.forEach($scope.players, function(player) {
              if (distance(player.latitude, player.longitude, obj.lat, obj.lng) < 0.01) {
                nearby.push(player);
              }
            });
            angular.forEach($scope.buildings, function(estate) {
              if (distance(estate.latitude, estate.longitude, obj.lat, obj.lng) < 0.01) {
                nearby.push(estate);
              }
            });
            if (nearby.length > 1) {
              $rootScope.$broadcast('clickedMarker', nearby);
            } else {
              $rootScope.$broadcast('clickedMarker', e.target.options.player || e.target.options.estate);
            }
          } else {
            $rootScope.$broadcast('clickedMarker', e.target.options.player || e.target.options.estate);
          }
        }

        var layer = new L.stamenTileLayer('toner'),
            map = new L.Map(attrs.id, {
              center: [$scope.player.latitude, $scope.player.longitude],
              zoom: 1,
              minZoom: 16,
              maxBounds: getMaxBounds()
            }),
            playerMarkers = {},
            buildingMarkers = {},
            playerMarker;

        map.addLayer(layer);
        map.on('click', onClick);

        var playerWatcher = $scope.$watch('players', function (playas) {
          if (playas) {
            angular.forEach(playas, function (playa) {
              var coords = [playa.latitude, playa.longitude];

              playerMarkers[playa.id] = L.marker(coords, {icon: peasantIcon, player: playa}).addTo(map).on('click', onClick);
            });

            playerWatcher();
          }
        });

        var buildingsWatcher = $scope.$watch('buildings', function (buildings) {
          if (buildings) {
            angular.forEach(buildings, function (building) {
              var coords = [building.latitude, building.longitude];
              var nodes = building.nodes.map(function(elem) {
                return [elem.latitude, elem.longitude];
              });
              if (building.player && building.player.name === $scope.player.name ) {
                // Tavo
                L.polygon(nodes, {color: '#FDC905', estate: building}).addTo(map).on('click', onClick);
              } else {
                if (building.player) {
                  L.polygon(nodes, {color: 'red', estate: building}).addTo(map).on('click', onClick);
                  // Kito
                } else {
                  L.polygon(nodes, {color: 'green', estate: building}).addTo(map).on('click', onClick);
                  // Laisvas

                }
              }

              // buildingMarkers[building.id] = L.marker(coords, {icon: buildingIcon, estate: building}).addTo(map).on('click', onClick);
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
          iconSize:     [40, 40],
          iconAnchor:   [22, 94],
          shadowAnchor: [4, 62],
          popupAnchor:  [-3, -76]
        });

        var buildingIcon = L.icon({
          iconUrl: 'assets/images/jasmine.png',
          iconSize:     [40, 40],
          iconAnchor:   [22, 94],
          shadowAnchor: [4, 62],
          popupAnchor:  [-3, -76]
        });

        function changeHandler () {
          var coords = [$scope.player.latitude, $scope.player.longitude];

          if (playerMarker) {
            playerMarker.setLatLng(coords);
          } else {
            // playerMarker = L.marker(coords, {
            //   icon: playerIcon,
            //   zIndexOffset: 1000,
            //   player: $scope.player
            // }).addTo(map);

            map.setView(coords, 18, {
              animate: true
            });
          }

          map.setMaxBounds(getMaxBounds());
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
              marker = playerMarkers[user.id];

          $scope.players.splice($scope.players.indexOf(user), 1);
          if (marker) map.removeLayer(marker);
          delete playerMarkers[user.id];
        }


        function getMaxBounds () {
          var player = $scope.player,
              lat = 0.5 * (1 / 110.574),
              lon = 0.5 * (1 / (111.32 * Math.cos(player.latitude)));

          if (player) {
            return [
              [player.latitude - lat, player.longitude - lon],
              [player.latitude + lat, player.longitude + lon]
            ];
          }
        }
      }
    };

  }]);
