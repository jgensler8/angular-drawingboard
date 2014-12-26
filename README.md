#angular-drawingboard

Some modifications and reworkings to [drawingboard.js](https://github.com/Leimi/drawingboard.js) for use with Angular

##Basic Use

Template:

```html
<ng-drawingboard remote="drawingboardRemote" options="options"></ng-drawingboard>
```

Controller:

```javascript
app.controller('appCtrl', ['$scope', function($scope) {
  $scope.drawingboardRemote = {
    on: {
      'startDraw': function(event) {
        //console.log('start drawing', event);
      },
      'endDraw': function(event) {
        //console.log('end drawing', event);
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
```

##Controls

###`remote`
button hooks. Hopefully this will give a way of balancing complex scope patterns with functions that will typically be linked up to buttons anyway. This is likely to change in the future but the idea is to leave as much "ui-rigging" up to the consumer as possible.

#### Events
```
{
  on: {
    'startDraw': function(event) ...
    'endDraw': function(event) ...
    'drawing': function(event) ...
  }
}
```
#### Drawing Modes
```
{
  drawingMode: 'pencil' // or 'pencil' or 'fill'
}
```

###`options`
control basic abilities of the canvas

#### History
```
{
  history: undefined // or 'session' or 'local' (for storage type)
}
```

===

##Version History

v0.1.0 - basic usage. storage not rigged up.