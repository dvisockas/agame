angular.module('game')
  .directive('map', ['$window', function ($window) {
    return {
      scope: {
        player: '=',
        players: '=',
        buildings: '='
      }, // {} = isolate, true = child, false/undefined = no change
      restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
      link: function ($scope, $elem, attrs) {
        var layer = new L.stamenTileLayer('toner'),
            map = new L.Map(attrs.id, {
              center: [$scope.player.latitude, $scope.player.longitude],
              zoom: 1
            }),
            markers = {},
            playerMarker;

        var playerWatcher = $scope.$watch('players', function (playas) {
          if (playas) {
            angular.forEach(playas, function (playa) {
              var coords = [playa.latitude, playa.longitude]
              
              if (playa.id !== $scope.player.id) {
                markers[playa.name] = L.marker(coords, {icon: peasantIcon}).addTo(map);
              }
            });

            playerWatcher();
          }
        });

        // var buildingsWatcher = $scope.$watch('buildings', function (buildings) {
        //   if (buildings) {
        //     angular.forEach(buildings, function (building) {
        //       var coords = [building.latitude, building.longitude];

        //       markers[building.name] = L.marker(coords, {icon: buildingIcon}).addTo(map);
        //     });

        //     buildingsWatcher();
        //   }
        // });

        map.addLayer(layer);

        $scope.$on('position-changed', changeHandler);

        var playerIcon = L.icon({
          iconUrl: 'assets/images/angular.png',
          iconSize:     [100, 100], // size of the icon
          iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
          shadowAnchor: [4, 62],  // the same for the shadow
          popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        var peasantIcon = L.icon({
          iconUrl: 'assets/images/yeoman.png',
          iconSize:     [80, 80], // size of the icon
          iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
          shadowAnchor: [4, 62],  // the same for the shadow
          popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        var buildingIcon = L.icon({
          iconUrl: 'assets/images/jasmine.png',
          iconSize:     [80, 80], // size of the icon
          iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
          shadowAnchor: [4, 62],  // the same for the shadow
          popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        function changeHandler () {
          var coords = [$scope.player.latitude, $scope.player.longitude];

          if (playerMarker) {
            playerMarker.setLatLng(coords);
          } else {
            playerMarker = L.marker(coords, {
              icon: playerIcon,
              zIndexOffset: 1000
            }).addTo(map);
          }

          map.setView(coords, 20, {
            animate: true
          });
        }

        function onError () {
          $window.alert('No game for you');
        }
      }
    };

  }]);
