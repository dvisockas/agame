angular.module('game')
  .directive('map', ['$window', function ($window) {
    return {
      scope: {
        player: '=',
        buildings: '='
      }, // {} = isolate, true = child, false/undefined = no change
      restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
      link: function ($scope, $elem, attrs) {
        var layer = new L.stamenTileLayer('toner'),
            map = new L.Map(attrs.id, {
              center: [54, 25],
              zoom: 1
            });

        map.addLayer(layer);

        var watcher = $window.navigator.geolocation.watchPosition(onSuccess, onError, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000
        });

        var greenIcon = L.icon({
          iconUrl: 'assets/images/angular.png',
          iconSize:     [95, 95], // size of the icon
          iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
          shadowAnchor: [4, 62],  // the same for the shadow
          popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        function onSuccess (data) {
          var coords = data.coords;
          if (coords) L.marker([coords.latitude, coords.longitude], {icon: greenIcon}).addTo(map);

          map.setView([coords.latitude, coords.longitude], 20, {
            animate: true
          });
        }

        function onError () {
          $window.alert('No game for you');
        }
      }
    };

  }]);
