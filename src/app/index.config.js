(function() {
  'use strict';

  angular
    .module('game')
    .config(configFn);

  configFn.$inject = ['RestangularProvider', 'localStorageServiceProvider'];
  function configFn (RestangularProvider, localStorageServiceProvider) {
    RestangularProvider.setBaseUrl('http://amapgame.herokuapp.com/v1');
    RestangularProvider.addResponseInterceptor(function (response) {
      return response.data;
    });

    localStorageServiceProvider.setPrefix('agame');
  }

})();
