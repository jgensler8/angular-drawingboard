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
  .module('ng-drawingboard', [])
  .directive('ngDrawingboard', [ function() {
    
    var util = {
      //canvas related
      toDataURL: function(canvas, type) {
        return canvas.toDataURL(type);
      },
      
      //storage related
      saveStorage: function(canvas, options) {
        if( options === 'session') {
          //TODO
        }
        else if ( options === 'local') {
          //TODO
        }
      },
      clearStorage: function() {
        
      },
      
      //drawing related
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
      
      //util
      _getInputCoords: function(e, context) {
    		e = e.originalEvent ? e.originalEvent : e;
    		var x, y;
    		if (e.touches && e.touches.length == 1) {
    			x = e.touches[0].pageX;
    			y = e.touches[0].pageY;
    		} else {
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
    		if (!this.opts.webStorage || !(this.opts.webStorage === 'session' || this.opts.webStorage === 'local')) return false;
    		return this.opts.webStorage + 'Storage';
    	}
    }
    
    return {
      template: '<canvas />',
      transclude: true,
      restrict: 'E',
      scope: {
        options: '=options',
        remote: '=remote'
      },
      link: function(scope, element, attrs) {
        /*
        
        check angular extend like $.extend()
        
        */
        if(!scope.remote) scope.remote= {};
        if(!scope.options) scope.options = {};
        scope.drawingMode = 'pencil';
        scope.canvas = element[0].firstChild;
        scope.context = scope.canvas.getContext('2d');
        scope.oldMidX = 0;
        scope.oldMidY = 0;
        scope.oldX = 0;
        scope.oldY = 0;
        
        /*
        Utility functions:
        (string) toDataURL(imageType)
        (void) clear();
        (boolean?) clearStorage();
        */
        scope.remote.toDataURL = function(type) {
          return util.toDataURL(scope.canvas, type);
        };
        
        scope.remote.clear = function() {
          return util.clear(scope.context);
        }
        
        scope.remote.clearStorage = function() {
          //TODO
        }
        
        /*
        scope.options = {
          color: "#000000",
          size: 1,
          background: "#fff",
          eraserColor: "background",
          fillTolerance: 100,
          fillHack: true, //try to prevent issues with anti-aliasing with a little hack by default
          webStorage: 'session',
          droppable: false,
          enlargeYourContainer: false
        }
        */
        element.bind(scope.drawingMode, scope.remote.drawingMode);
        
        element.bind('mousedown touchstart', function(event) {
          scope.drawing = true;
          
          
          //callback
          if(scope.drawingMode === 'pencil' && scope.remote.on['startDraw']) scope.remote.on['startDraw'](event);
        });
        
        element.bind('mouseup touchend', function(event) {
          scope.drawing = false;
          
          //save state
          if(scope.options.webStorage) util.saveStorage(scope.canvas, scope.options.webStorage);
          
          //callback
          if(scope.drawingMode === 'pencil' && scope.remote.on['endDraw']) scope.remote.on['endDraw'](event);
        });
        
        element.bind('mousemove touchmove', function(event) {
          var eventCoords = util._getInputCoords(event, scope.context);
          var curMidCoords = util._getMidCoords(scope.oldX, scope.oldY, eventCoords.x, eventCoords.y);
        
          if(scope.drawingMode === 'pencil' && scope.drawing) {
            util.draw(scope.context, scope.oldX, scope.oldY, scope.oldMidX, scope.oldMidY, eventCoords.x, eventCoords.y, curMidCoords.x, curMidCoords.y);
            
            //callback
            if(scope.remote.on['drawing']) scope.remote.on['drawing'](event);
          }
          scope.oldX = eventCoords.x;
          scope.oldY = eventCoords.y;
          scope.oldMidX = curMidCoords.x;
          scope.oldMidY = curMidCoords.y;
        });
        
        element.bind('mouseleave', function(event) {
          scope.drawing = false;
          
          //callback
          if(scope.drawingMode === 'pencil' && scope.remote.on['endDraw']) scope.remote.on['endDraw'];
        });
      }
    }
  }])
  
})();