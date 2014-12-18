var app = angular.module('testApp', ['ng-drawingboard']);

app.controller('appCtrl', ['$scope', function($scope) {
  $scope.drawingboardRemote = {
    on: {
      'startDraw': function(event) {
        console.log('start drawing', event);
      },
      'endDraw': function(event) {
        console.log('end drawing', event);
      },
      'drawing': function(event) {
        //console.log('drawing', event);
      }
    },
    drawingMode: 'eraser'
  };
  
  $scope.getDataURL = function() {
    console.log($scope.drawingboardRemote.toDataURL('image/png'));
  };
  
  $scope.clear = function() {
    console.log($scope.drawingboardRemote.clear());
  };
  
  $scope.drawingboardOptions = {
    history: true
  };
  
}]);