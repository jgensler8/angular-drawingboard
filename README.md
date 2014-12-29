#angular-drawingboard

Some modifications and reworkings to [drawingboard.js](https://github.com/Leimi/drawingboard.js) for use with Angular

##Basic Use

Template:

```html
<ng-drawingboard remote="drawingboardRemote" drawingMode="drawingMode" eraseColor="eraseColor" drawColor="drawColor" lineWidth="lineWidth" webStorage="webStorage" backgroundColor="backgroundColor"></ng-drawingboard>
```

Controller:

```javascript
app.controller('appCtrl', ['$scope', function($scope) {
  $scope.drawingModes = ['draw', 'eraser', 'fill'];
  $scope.webStorage = 'session';
  $scope.drawingMode = 'eraser';
  $scope.drawColor = '#00FF00';
  $scope.eraseColor = '#FF00FF';
  $scope.lineWidth = 20;
  $scope.backgroundColor = '#F00000';
  $scope.canvasWidth = 'parent';
  $scope.canvasHeight = 'parent';
  
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
}]);
```

##Attributes
control basic abilities of the canvas

```html
<ng-drawingboard webStorage='local'></ng-drawingboard> <!-- 'local' or 'session' -->
<ng-drawingboard drawingMode='draw'></ng-drawingboard> <!-- 'draw' or 'eraser or 'fill' -->
<ng-drawingboard drawColor='#FFFFFF'></ng-drawingboard> <!-- hex string -->
<ng-drawingboard eraseColor='#000000'></ng-drawingboard> <!-- hex string -->
<ng-drawingboard lineWidth='10'></ng-drawingboard> <!-- integer -->
<ng-drawingboard backgroundColor='#FF0000'></ng-drawingboard> <!-- hex string -->
<ng-drawingboard canvasWidth='parent'></ng-drawingboard> <!-- integer -->
<ng-drawingboard canvasHeight='parent'></ng-drawingboard> <!-- integer -->
<ng-drawingboard remote='remoteObj'></ng-drawingboard> <!-- see below -->
```

####`remote`
event hooks. I am not quite sure what this might be useful for but I have added it if the need arises.

```javascript
//remoteObj =
{
  'startDraw': function(event) ...
  'endDraw': function(event) ...
  'drawing': function(event) ...
  'startErase': function(event) ...
  'endErase': function(event) ...
  'erasing': function(event) ...
  'fill': function(event) ...
}
```

===

###Version History

- v0.2.0 - basic usage: colors, width, storage, drawing modes
- v0.1.0 - basic usage. storage not rigged up.