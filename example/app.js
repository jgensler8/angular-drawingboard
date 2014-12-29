var app = angular.module('testApp', ['ng-drawingboard']);

app.controller('appCtrl', ['$scope', function($scope) {
  $scope.drawingModes = ['draw', 'eraser', 'fill'];
  $scope.webStorage = 'session';
  $scope.drawingMode = 'eraser';
  $scope.drawColor = '#00FF00';
  $scope.eraseColor = '#FF00FF';
  $scope.lineWidth = 1;
  $scope.backgroundColor = '#F00000';
  $scope.canvasWidth = '300';
  $scope.canvasHeight = '300';
  
  $scope.drawingboardRemote = {
    'startDraw': function(event) {
      console.log('start drawing', event);
    },
    'endDraw': function(event) {
      console.log('end drawing', event);
    },
    'drawing': function(event) {
      //console.log('drawing', event);
    },
    'startErase': function(event) {
      console.log('start erase', event);
    },
    'endErase': function(event) {
      console.log('end erase', event);
    },
    'erasing': function(event) {
      //console.log('erasing', event);
    },
    'fill': function(event) {
      console.log('filled', event);
    }
  };
  
  $scope.getDataURL = function() {
    console.log($scope.drawingboardRemote.toDataURL('image/png'));
  };
  
  $scope.clear = function() {
    console.log($scope.drawingboardRemote.clear());
  };
  
  $scope.undo = function() {
    console.log($scope.drawingboardRemote.undo());
  };
  
  $scope.redo = function() {
    console.log($scope.drawingboardRemote.redo());
  };
  
  $scope.clearHistory = function() {
    console.log($scope.drawingboardRemote.clearStorage());
  };
  
}]);