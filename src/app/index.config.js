(function() {
  'use strict';

  angular
    .module('game')
    .config(configFn);

  configFn.$inject = ['RestangularProvider', 'localStorageServiceProvider'];
  function configFn (RestangularProvider, localStorageServiceProvider) {
    RestangularProvider.setBaseUrl('http://amapgame.herokuapp.com/v1');

    localStorageServiceProvider.setPrefix('agame');
  }

})();
