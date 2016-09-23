var app = angular.module('Housimento', ['ngMaterial', 'ngMdIcons']);

app.controller('AppCtrl', ['$scope', '$http', '$mdDialog', function ($scope, $http, $mdDialog) {
  $scope.label = 'Gautam'
  $http.get('twitterData.json').then(function (response) {
    console.log('response', response);
    renderScore(response.data, $scope);
  });
}]);

function _getSentimentScore(info) {
  var score = 0;
  info.forEach(function (item) {
    if (item.sentimentAnalysis) {
      score += parseFloat(item.sentimentAnalysis.score);
    }
  });
  var avgScore = score / info.length;
  return _.round(avgScore, 2);
}

function renderScore(info, $scope) {
  var colors = ['#fbdf5f', '#4aad62', '#e74565'];
  var score = this._getSentimentScore(info);
  // score = 0.49;
  // score *= 100;
  console.log('score', score);
  $scope.score = score;
  var activeClass = '';  

  if (score < 0) {
    activeClass = 'bg-red';
  }
  else if (score === 0) {
    activeClass = 'bg-amber';
  }
  else {
    activeClass = 'bg-green';
  }
  $scope.activeClass = activeClass;
}

function DialogController($scope, $mdDialog) {
  $scope.hide = function () {
    $mdDialog.hide();
  };
  $scope.cancel = function () {
    $mdDialog.cancel();
  };
  $scope.answer = function (answer) {
    $mdDialog.hide(answer);
  };
};

function getSentimentData($http) {

}

app.config(function ($mdThemingProvider) {
  var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50'],
    '50': 'ffffff'
  });
  $mdThemingProvider.definePalette('customBlue', customBlueMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('customBlue', {
      'default': '500',
      'hue-1': '50'
    })
    .accentPalette('pink');
  $mdThemingProvider.theme('input', 'default')
    .primaryPalette('grey')
});
