#angular-drawingboard

===

Some modifications and reworkings to [drawingboard.js](https://github.com/Leimi/drawingboard.js) for use with Angular

===

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
to hook up buttons to drawingboard specific functions. Hopefully this will give a way of balancing complex scope patterns with functions that will typically be linked up to buttons anyway. This is likely to change in the future but the idea is to leave as much "ui-rigging" up to the consumer as possible.

###`options`: control basic functionality of the canvas