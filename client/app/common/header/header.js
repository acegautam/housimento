import angular from 'angular';
import uiRouter from 'angular-ui-router';
import headerComponent from './header.component';
import headerService from './header.service';

let headerModule = angular.module('header', [
  uiRouter
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state('header', {
      url: '/header',
      template: '<header></header>'
    });
})

.component('header', headerComponent)
.service('HeaderService', headerService);

export default headerModule;
