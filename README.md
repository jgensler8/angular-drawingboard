#angular-drawingboard

Some modifications and reworkings to [drawingboard.js](https://github.com/Leimi/drawingboard.js) for use with Angular

##Basic Use

Template:

```html
<ng-drawingboard remote="drawingboardRemote" lineWidth="10"></ng-drawingboard>
```

Controller:

```javascript
app.controller('appCtrl', ['$scope', function($scope) {
  //TODO
}]);
```

##Controls

###`remote`
button hooks. Hopefully this will give a way of balancing complex scope patterns with functions that will typically be linked up to buttons anyway. This is likely to change in the future but the idea is to leave as much "ui-rigging" up to the consumer as possible.

```javascript
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

###`options`
control basic abilities of the canvas

```html
<ng-drawingboard webStorage='local'></ng-drawingboard> <!-- or 'session' -->
<ng-drawingboard drawingMode='draw'></ng-drawingboard> <!-- or 'eraser or 'fill' -->
<ng-drawingboard drawColor='#FFFFFF'></ng-drawingboard>
<ng-drawingboard eraseColor='#000000'></ng-drawingboard>
<ng-drawingboard lineWidth='10'></ng-drawingboard>
```

===

##Version History

v0.1.0 - basic usage. storage not rigged up.