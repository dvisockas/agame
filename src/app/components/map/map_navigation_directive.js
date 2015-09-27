angular.module('game')
  .directive('mapNavigation', ['$window', '$swipe', 'Restangular', function ($window, $swipe, Restangular) {
    return {
      scope: {
        player: '=',
      }, // {} = isolate, true = child, false/undefined = no change
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      templateUrl: 'app/components/map/map_navigation.html',
      link: function ($scope, $elem, attrs) {
        $scope.attack = function(estate) {
          alert("O, koks mandras!");
        };

        $scope.nearby = function(obj) {
          return distance(obj.latitude, obj.longitude, $scope.player.latitude, $scope.player.longitude) < 0.12;
        };

        $scope.$on('clickedMarker', function(e, data) {
          delete $scope.estateTypes;

          $scope.options = [];
          $scope.object = {};

          if (angular.isArray(data)) {
            $scope.options = data;
          } else {
            $scope.object = data;
          }

          $scope.$apply();
        });

        $scope.setActive = function (object) {
          $scope.options = [];
          $scope.object = object;
        };

        $scope.getEstateTypes = function (estate) {
          Restangular.one('estates', estate.id).all('estate_types').getList().then(function (types) {
            $scope.estateTypes = types;
          });
        };

        $scope.buyEstate = function (estateType, estate) {
          Restangular.one('estates', estate.id).patch({
            estate: {
              estate_type_id: estateType.id,
              player_id: $scope.player.id
            }
          }).then(function (boughtEstate) {
            angular.forEach(Restangular.stripRestangular(boughtEstate), function (val, prop) {
              estate[prop] = val;
            });

            $scope.player.gold -= estateType.cost;

            delete $scope.estateTypes;
          });
        };

        $scope.canAfford = function (estate) {
          return $scope.player.gold >= estate.cost;
        };

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
      }
    }
  }
]);
