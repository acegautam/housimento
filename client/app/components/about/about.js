import angular from 'angular';
import uiRouter from 'angular-ui-router';
import aboutComponent from './about.component';
import aboutService from './about.service';
import Info from './info/info';

let aboutModule = angular.module('about', [
  uiRouter,
  Info.name
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state('about', {
      url: '/about',
      template: '<about></about>'
    });
})

.component('about', aboutComponent)
.service('AboutService', aboutService);

export default aboutModule;
