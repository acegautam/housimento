import angular from 'angular';
import angularAnimation from 'angular-animate';
import angularAria from 'angular-aria';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import ngMdIcons from 'angular-material-icons';
import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';

angular.module('app', [
  uiRouter,
  ngMaterial,
  ngMdIcons,
  Common.name,
  Components.name
])
  .config(($locationProvider, $mdThemingProvider) => {
    "ngInject";
    // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
    // #how-to-configure-your-server-to-work-with-html5mode
    $locationProvider.html5Mode(true).hashPrefix('!');

    // let theme = setDefaultTheme($mdThemingProvider);
    let theme = setCustomTheme($mdThemingProvider);
    toggleDarkMode(theme, false);

  })

  .component('app', AppComponent);

function setDefaultTheme($mdThemingProvider) {
  return $mdThemingProvider.theme('default');
}

function setCustomTheme($mdThemingProvider) {

  // Angular material - custom theming
  var customBlueMap = $mdThemingProvider.extendPalette('indigo', {
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50'],
    '50': 'ffffff'
  });
  $mdThemingProvider.definePalette('customBlue', customBlueMap);
  return $mdThemingProvider.theme('default')
    .primaryPalette('customBlue', {
      'default': '500',
      'hue-1': '50'
    })
    .accentPalette('pink');
}

function toggleDarkMode(theme, isDark) {
  if (isDark) {
    theme.dark();
  }
}