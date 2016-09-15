import angular from 'angular';
import uiRouter from 'angular-ui-router';
import footerComponent from './footer.component';
import footerService from './footer.service';

let footerModule = angular.module('footer', [
  uiRouter
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state('footer', {
      url: '/footer',
      template: '<footer></footer>'
    });
})

.component('footer', footerComponent)
.service('FooterService', footerService);

export default footerModule;
