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
      toDataURL: function(canvas, type) {
        return canvas.toDataURL(type);
      },
      
      //storage related
      initStorage: function(canvas, webStorage) {
        var id = canvas.id || 'tempID';
        //if the user decides they need storage later
        $sessionStorage[id] = [];
        $localStorage[id] = [];
        if (webStorage === 'session') {
          this.save(canvas, webStorage);
        }
        else if (webStorage === 'local') {
          this.save(canvas, webStorage);
        }
      },
      save: function(canvas, webStorage) {
        var id = canvas.id || 'tempID';
        
        if ( webStorage === 'session') {
          if( currentImageIndex < $sessionStorage[id].length)
            $sessionStorage[id].slice(currentImageIndex + 1, $sessionStorage[id].length);
            
          currentImageIndex = $sessionStorage[id].length;
          $sessionStorage[id].push(this.toDataURL(canvas, 'image/png'));
          ++currentImageIndex;
        }
        else if ( webStorage === 'local') {
          if( currentImageIndex < $localStorage[id].length)
            $localStorage[id].slice(currentImageIndex + 1, $localStorage[id].length);
            
          currentImageIndex = $localStorage[id].length;
          $localStorage[id].push(this.toDataURL(canvas, 'image/png'));
          ++currentImageIndex;
        }
      },
      undo: function(canvas, context, webStorage) {
        if(currentImageIndex <= 0) return;
        var id = canvas.id || 'tempID';
        
        if ( webStorage === 'session') {
          --currentImageIndex;
          this.setIMG(canvas, context, $sessionStorage[id][currentImageIndex]);
        }
        else if ( webStorage === 'local') {
          --currentImageIndex;
          this.setIMG(canvas, context, $localStorage[id][currentImageIndex]);
        }
      },
      redo: function(canvas, context, webStorage) {
        var id = canvas.id || 'tempID';
        
        if ( webStorage === 'session') {
          if(currentImageIndex >= $sessionStorage[id].length) return;
          
          --currentImageIndex;
          this.setIMG(canvas, context, $sessionStorage[id][currentImageIndex]);
        }
        else if ( webStorage === 'local') {
          if(currentImageIndex >= $localStorage[id].length) return;
          
          --currentImageIndex;
          this.setIMG(canvas, context, $localStorage[id][currentImageIndex]);
        }
      },
      clearStorage: function(canvas, webStorage) {
        if ( webStorage === 'session') {
          $sessionStorage.$reset();
        }
        else if ( webStorage === 'local') {
          $localStorage.$reset();
        }
      },
      
      //drawing related
      initDrawingStyle: function(context, lineWidth) {
        context.lineWidth = lineWidth;
      },
      draw: function(context, oldX, oldY, oldMidX, oldMidY, newX, newY, curMidX, curMidY) {
  			context.beginPath();
  			context.moveTo(curMidX, curMidY);
  			context.quadraticCurveTo(oldX, oldY, oldMidX, oldMidY);
  			context.stroke();
  		},
      fill: function() {
        //TODO
      },
      clear: function(context) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.width);
      },
      setIMG: function(canvas, context, src) {
        var img = new Image();
    		var oldGCO = context.globalCompositeOperation;
    		img.onload = function() {
    			context.globalCompositeOperation = "source-over";
    			context.clearRect(0, 0, canvas.width, canvas.height);
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
        lineWidth: '=linewidth'
      },
      link: function(scope, element, attrs) {
        scope.canvas = element[0].firstChild;
        scope.context = scope.canvas.getContext('2d');
        scope.oldMidX = 0;
        scope.oldMidY = 0;
        scope.oldX = 0;
        scope.oldY = 0;
        
        util.initStorage(scope.canvas, scope.webStorage);
        util.initDrawingStyle(scope.context, scope.lineWidth);
        
        scope.remote = angular.extend({
          toDataURL: function(type) {
            return util.toDataURL(scope.canvas, type);
          },
          clear: function() {
            return util.clear(scope.context);
          },
          clearStorage: function() {
            return util.clearStorage();
          },
          undo: function() {
            return util.undo(scope.canvas, scope.context, scope.webStorage);
          },
          redo: function() {
            return util.redo(scope.canvas, scope.context, scope.webStorage);
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
          
          if (scope.drawingMode === 'draw') {
            scope.context.strokeStyle = scope.drawColor;
            
            //callback
            scope.remote.startDraw(event);
          }
          else if (scope.drawingMode === 'fill') {
            var eventCoords = util._getInputCoords(event, scope.context);
            util.fill(context, eventCoords);
            
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
          if(scope.webStorage) util.save(scope.canvas, scope.webStorage);
          
          //callback
          if (scope.drawingMode === 'draw') scope.remote.endDraw(event);
          else if ( scope.drawingMode === 'eraser') scope.remote.endErase(event);
        });
        
        element.bind('mousemove touchmove', function(event) {
          var eventCoords = util._getInputCoords(event, scope.context);
          var curMidCoords = util._getMidCoords(scope.oldX, scope.oldY, eventCoords.x, eventCoords.y);
        
          if (scope.drawing === true) {
            util.draw(scope.context, scope.oldX, scope.oldY, scope.oldMidX, scope.oldMidY, eventCoords.x, eventCoords.y, curMidCoords.x, curMidCoords.y);
            
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
            if(scope.webStorage) util.save(scope.canvas, scope.webStorage);
            
            if (scope.drawingMode === 'draw') {
              scope.remote.endDraw(event);
              scope.drawing = false;
            }
            else if (scope.drawingMode === 'eraser'){
              scope.remote.endErase(event);
              scope.drawing = false;
            }
          }
        });
        
      }
    };
  }]);
  
})();