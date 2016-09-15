import angular from 'angular';
import uiRouter from 'angular-ui-router';
import infoComponent from './info.component';
import infoService from './info.service';

let infoModule = angular.module('info', [
  uiRouter
])

.component('info', infoComponent)
.service('InfoService', infoService);

export default infoModule;
