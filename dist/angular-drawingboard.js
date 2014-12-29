/* angular-drawingboard v0.1.0 - https://github.com/Leimi/drawingboard.js
* Copyright (c) 2014 Jeffrey Gensler
* Licensed MIT */
/*
// from: http://www.sitepoint.com/web-foundations/mime-types-complete-list/
      imageMIMEtypes: [
      //canvas.toDataURL() --> image/jpeg
      "image/jpeg",
      
      // canvas.toDataURL() --> image/png
      "image/png",
      "image/bmp", "image/cmu-raster", "image/fif", "image/florian", "image/g3fax", "image/gif", "image/ief", "image/jutvision", "image/naplps", "image/pict", "image/pjpeg", "image/tiff", "image/vasa", "image/vnd.dwg", "image/vnd.dwg", "image/vnd.fpx", "image/vnd.net-fpx", "image/vnd.rn-realflash", "image/vnd.rn-realpix", "image/vnd.wap.wbmp", "image/vnd.xiff", "image/x-cmu-raster", "image/x-dwg", "image/x-dwg", "image/x-icon", "image/x-jg", "image/x-niff", "image/x-pcx", "image/x-pict", "image/x-pixmap", "image/x-portable-anymap", "image/x-portable-bitmap", "image/x-portable-graymap", "image/x-portable-greymap", "image/x-portable-pixmap", "image/x-quicktime", "image/x-rbg", "image/x-tiff", "image/x-windows-bmp", "image/x-xbitmap", "image/x-xbm", "image/x-xwd", "image/x-xwindowdump", "image/xbm", "image/xjps", "image/xpm"]
*/
(function(){
  
  angular
  .module('ng-drawingboard', ['ngStorage'])
  .directive('ngDrawingboard', [ '$sessionStorage', '$localStorage', function($sessionStorage, $localStorage) {
    var currentImageIndex = 0;
    
    var util = {
      //canvas related
      toDataURL: function(context, type) {
        return context.canvas.toDataURL(type);
      },
      
      //storage related
      initStorage: function(context, webStorage) {
        var id = context.canvas.id || 'tempID';
        //if the user decides they need storage later
        if (webStorage === 'session') {
          if ($sessionStorage[id]) {
            this.setIMG(context, $sessionStorage[id][$sessionStorage[id].length - 1]);
            currentImageIndex = $sessionStorage[id].length - 1;
          }
          else {
            $sessionStorage[id] = [];
            this.save(context, webStorage);
          }
        }
        else if (webStorage === 'local') {
          if ($localStorage[id]) {
            this.setIMG(context, $localStorage[id][$localStorage[id].length - 1]);
            currentImageIndex = $localStorage[id].length - 1;
          }
          else {
            $localStorage[id] = [];
            this.save(context, webStorage);
          }
        }
      },
      save: function(context, webStorage) {
        var id = context.canvas.id || 'tempID';
        
        if ( webStorage === 'session') {
          //if we are in the middle of the history
          if( currentImageIndex < $sessionStorage[id].length)
            $sessionStorage[id].splice(currentImageIndex + 1, $sessionStorage[id].length - currentImageIndex);
            
          currentImageIndex = $sessionStorage[id].length;
          $sessionStorage[id].push(this.toDataURL(context, 'image/png'));
        }
        else if ( webStorage === 'local') {
          //if we are in the middle of the history
          if( currentImageIndex < $localStorage[id].length)
            $localStorage[id].splice(currentImageIndex + 1, $localStorage[id].length - currentImageIndex);
            
          currentImageIndex = $localStorage[id].length;
          $localStorage[id].push(this.toDataURL(context, 'image/png'));
        }
      },
      undo: function(context, webStorage) {
        if(currentImageIndex <= 0) return false;
        var id = context.canvas.id || 'tempID';
        
        if ( webStorage === 'session') {
          --currentImageIndex;
          this.setIMG(context, $sessionStorage[id][currentImageIndex]);
        }
        else if ( webStorage === 'local') {
          --currentImageIndex;
          this.setIMG(context, $localStorage[id][currentImageIndex]);
        }
        return true;
      },
      redo: function(context, webStorage) {
        var id = context.canvas.id || 'tempID';
        
        if ( webStorage === 'session') {
          if(currentImageIndex + 1 >= $sessionStorage[id].length) return false;
          console.log("increasing");
          ++currentImageIndex;
          this.setIMG(context, $sessionStorage[id][currentImageIndex]);
        }
        else if ( webStorage === 'local') {
          if(currentImageIndex + 1 >= $localStorage[id].length) return false;
          
          ++currentImageIndex;
          this.setIMG(context, $localStorage[id][currentImageIndex]);
        }
        return true;
      },
      clearStorage: function(context, webStorage) {
        var id = context.canvas.id || 'tempID';
        
        if ( webStorage === 'session') {
          $sessionStorage[id] = undefined;
        }
        else if ( webStorage === 'local') {
          $localStorage[id] = undefined;
        }
        return this.initStorage(context, webStorage);
      },
      
      //drawing related
      initBackground: function(context, backgroundColor, canvasWidth, canvasHeight, parent) {
        if(canvasWidth === 'parent') context.canvas.width = parent.offsetWidth;
        else context.canvas.width = canvasWidth || 300;
        
        if(canvasHeight === 'parent') context.canvas.height = parent.offsetWidth;
        else context.canvas.height = canvasHeight || 150;
        context.fillStyle = backgroundColor;
			  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      },
      initDrawingStyle: function(context, lineWidth) {
        context.lineWidth = lineWidth;
        context.lineJoin = context.lineCap = 'round';
      },
      draw: function(context, oldX, oldY, oldMidX, oldMidY, curMidX, curMidY) {
  			context.beginPath();
  			context.moveTo(curMidX, curMidY);
  			context.quadraticCurveTo(oldX, oldY, oldMidX, oldMidY);
  			context.stroke();
  		},
      fill: function(context, eventCoords) {
    		var img = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    
    		// constants identifying pixels components
    		var INDEX = 0, X = 1, Y = 2, COLOR = 3;
    
    		// target color components
    		var stroke = context.strokeStyle;
    		var r = parseInt(stroke.substr(1, 2), 16);
    		var g = parseInt(stroke.substr(3, 2), 16);
    		var b = parseInt(stroke.substr(5, 2), 16);
    
    		// starting point
    		var start = this._pixelAt(img, parseInt(eventCoords.x, 10), parseInt(eventCoords.y, 10));
    		var startColor = start[COLOR];
    		
    		// no need to continue if starting and target colors are the same
    		if (this._compareColors(startColor, this._RGBToInt(r, g, b)))
    			return false;
    
    		// pixels to evaluate
    		var queue = [start];
    
    		// loop vars
    		var pixel, x, y;
    		var maxX = img.width - 1;
    		var maxY = img.height - 1;
    
    		function updatePixelColor(pixel) {
    			img.data[pixel[INDEX]] = r;
    			img.data[pixel[INDEX] + 1] = g;
    			img.data[pixel[INDEX] + 2] = b;
    		}
    
    		while ((pixel = queue.pop())) {
    			updatePixelColor(pixel);
    
    			if (this._compareColors(pixel[COLOR], startColor)) {
    				if (pixel[X] > 0) // west
    					queue.push(this._pixelAt(img, pixel[X] - 1, pixel[Y]));
    				if (pixel[X] < maxX) // east
    					queue.push(this._pixelAt(img, pixel[X] + 1, pixel[Y]));
    				if (pixel[Y] > 0) // north
    					queue.push(this._pixelAt(img, pixel[X], pixel[Y] - 1));
    				if (pixel[Y] < maxY) // south
    					queue.push(this._pixelAt(img, pixel[X], pixel[Y] + 1));
    			}
    		}
    
    		context.putImageData(img, 0, 0);
    		return true;
      },
      clear: function(context, backgroundColor, canvasWidth, canvasHeight, parent) {
        util.initBackground(context, backgroundColor, canvasWidth, canvasHeight, parent);
      },
      setIMG: function(context, src) {
        var img = new Image();
    		var oldGCO = context.globalCompositeOperation;
    		img.onload = function() {
    			context.globalCompositeOperation = "source-over";
    			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    			context.drawImage(img, 0, 0);
    
    /*
    			if (opts.stretch) {
    				context.drawImage(img, 0, 0, canvas.width, canvas.height);
    			} else {
    				context.drawImage(img, 0, 0);
    			}
    			*/
          
    			context.globalCompositeOperation = oldGCO;
    		};
    		
    		img.src = src;
      },
      
      //util
      _getInputCoords: function(e, context) {
    		e = e.originalEvent ? e.originalEvent : e;
    		var x, y;
    		if (e.touches && e.touches.length == 1) {
    			x = e.touches[0].pageX;
    			y = e.touches[0].pageY;
    		}
    		else {
    			x = e.pageX;
    			y = e.pageY;
    		}
    		return {
    			x: x - context.canvas.offsetLeft,
    			y: y - context.canvas.offsetTop
    		};
    	},
    	_getMidCoords: function(x1, y1, x2, y2) {
    		return {
    			x: (x1 + x2) >> 1,
    			y: (y1 + y2) >> 1
    		};
    	},
    	_getStorage: function() {
    		if (!this.opts.webStorage || !(this.opts.webStorage === 'session' || this.opts.webStorage === 'local'))
    		  return false;
    		return this.opts.webStorage + 'Storage';
    	},
    	_pixelAt: function(img, x, y) {
    	  var i = (y * img.width + x) * 4;
      	var c = this._RGBToInt(
      		img.data[i],
      		img.data[i + 1],
          img
        );
      
      	return [
      		i, // INDEX
      		x, // X
      		y, // Y
      		c  // COLOR
      	];
    	},
    	_compareColors: function(colorOne, colorTwo) {
    	  return colorOne === colorTwo;
    	},
    	_RGBToInt: function(r, g, b) {
    	  var c = 0;
      	c |= (r & 255) << 16;
      	c |= (g & 255) << 8;
      	c |= (b & 255);
      	return c;
    	}
    };
    
    return {
      template: '<canvas />',
      transclude: true,
      restrict: 'E',
      scope: {
        remote: '=remote',
        
        webStorage: '=webstorage',
        drawingMode: '=drawingmode',
        drawColor: '=drawcolor',
        eraseColor: '=erasecolor',
        lineWidth: '=linewidth',
        backgroundColor: '=backgroundcolor',
        canvasWidth: '=canvaswidth',
        canvasHeight: '=canvasheight'
      },
      link: function(scope, element, attrs) {
        scope.canvas = element[0].firstChild;
        scope.context = scope.canvas.getContext('2d');
        scope.oldMidX = 0;
        scope.oldMidY = 0;
        scope.oldX = 0;
        scope.oldY = 0;
        
        util.initBackground(scope.context, scope.backgroundColor, scope.canvasWidth, scope.canvasHeight, element.parent()[0]);
        util.initDrawingStyle(scope.context, scope.lineWidth);
        util.initStorage(scope.context, scope.webStorage);
        
        scope.remote = angular.extend({
          toDataURL: function(type) {
            return util.toDataURL(scope.context, type);
          },
          clear: function() {
            util.clear(scope.context, scope.backgroundColor, scope.canvasWidth, scope.canvasHeight, element.parent()[0]);
            return util.save(scope.context, scope.webStorage);
          },
          clearStorage: function() {
            return util.clearStorage(scope.context, scope.webStorage);
          },
          undo: function() {
            return util.undo(scope.context, scope.webStorage);
          },
          redo: function() {
            return util.redo(scope.context, scope.webStorage);
          },
          startDraw: function(){},
          endDraw: function(){},
          drawing: function(){},
          
          startErase: function(){},
          endErase: function(){},
          erasing: function(){},
          
          fill: function(){}
        }, scope.remote);
        
        scope.$watch('lineWidth', function(newVal, oldVal) {
          scope.context.lineWidth = newVal;
        });
        
        element.bind('mousedown touchstart', function(event) {
          scope.drawing = true;
          var eventCoords = util._getInputCoords(event, scope.context);
          scope.oldX = scope.oldMidX = eventCoords.x;
          scope.oldY = scope.oldMidY = eventCoords.y;
          
          if (scope.drawingMode === 'draw') {
            scope.context.strokeStyle = scope.drawColor;
            
            //callback
            scope.remote.startDraw(event);
          }
          else if (scope.drawingMode === 'fill') {
            scope.context.strokeStyle = scope.drawColor;
            util.fill(scope.context, eventCoords);
            
            //callback
            scope.remote.fill(event);
          }
          else if (scope.drawingMode === 'eraser') {
            scope.context.strokeStyle = scope.eraseColor;
            
            //callback
            scope.remote.startErase(event);
          }
        });
        
        element.bind('mouseup touchend', function(event) {
          scope.drawing = false;
          
          //save state
          if (scope.webStorage) util.save(scope.context, scope.webStorage);
          
          //callback
          if (scope.drawingMode === 'draw') scope.remote.endDraw(event);
          else if ( scope.drawingMode === 'eraser') scope.remote.endErase(event);
        });
        
        element.bind('mousemove touchmove', function(event) {
          var eventCoords = util._getInputCoords(event, scope.context);
          var curMidCoords = util._getMidCoords(scope.oldX, scope.oldY, eventCoords.x, eventCoords.y);
          //var curMidCoords = util._getMidCoords(eventCoords.x, eventCoords.y, eventCoords.x, eventCoords.y);
        
          if (scope.drawing === true) {
            util.draw(scope.context, scope.oldX, scope.oldY, scope.oldMidX, scope.oldMidY, curMidCoords.x, curMidCoords.y);
            
            //callback
            if (scope.drawingMode === 'draw') {
              scope.remote.drawing(event);
            }
            else if (scope.drawingMode === 'eraser') {
              scope.remote.erasing(event);
            }
          }
          
          scope.oldX = eventCoords.x;
          scope.oldY = eventCoords.y;
          scope.oldMidX = curMidCoords.x;
          scope.oldMidY = curMidCoords.y;
        });
        
        element.bind('mouseleave', function(event) {
          //if we were drawing, finish the last draw
          if (scope.drawing === true)  {
            scope.drawing = false;
            
            //save state
            if(scope.webStorage) util.save(scope.context, scope.webStorage);
            
            //callback
            if (scope.drawingMode === 'draw') {
              scope.remote.endDraw(event);
            }
            else if (scope.drawingMode === 'eraser'){
              scope.remote.endErase(event);
            }
          }
        });
        
      }
    };
  }]);
  
})();