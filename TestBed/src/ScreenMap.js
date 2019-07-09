(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("ScreenMap", [], factory);
	else if(typeof exports === 'object')
		exports["ScreenMap"] = factory();
	else
		root["ScreenMap"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ScreenMap.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/SMScreen.js":
/*!*************************!*\
  !*** ./src/SMScreen.js ***!
  \*************************/
/*! exports provided: SMScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SMScreen", function() { return SMScreen; });
/*----------------------------------------------------------------------------------------------------------
::“Copyright 2018 Clayton Burnett”
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the main abstraction for a single screen
 *
 * @author Clayton Burnett <the82professional@hotmail.com>
 */
/**
 * ###############################################################################################################
 *                                              SMScreen
 */
/**
 * @class
 * Class modeling a canvas screen
 *
 * @description
 * A screen is modeled as a pair of blitting canvas elements
 **/
/**
* @constructor
*/
class SMScreen {
    constructor(Canvas, IniRes, ID) {
        this.Canvas = Canvas;
        this.IniRes = IniRes;
        this.ID = ID;
        /**
        * Function to flip the displayed screens by swapping video buffer
        */
        this.Blit = function () {
            if (this.bctx && this.ctx) {
                var offscreen_data = this.bctx.getImageData(0, 0, this.Res[0], this.Res[1]);
                this.ctx.putImageData(offscreen_data, 0, 0);
            }
        };
        //Default Constructor
        this.Res = IniRes || new Array(1000, 1000);
        this.DOMArray = new Array();
        this.ID = ID || 0;
        this.RenderFlag = true;
        this.RenderRate = 0; //Used internally to calculate refresh
        this.BackgroundImages = new Array(); //The Current array of background Images
        this.eooFlag = true;
        if (Canvas) {
            for (let i of Canvas) {
                if (this.eooFlag == true) {
                    this.ctx = i.getContext('2d');
                    this.eooFlag = false;
                }
                else {
                    this.bctx = i.getContext('2d');
                    this.eooFlag = true;
                }
            }
        }
    }
    //-------------------------------------------------------------SET METHODS---------------------------
    /**
    * Set the element screen resolution
    * @param {Integer} Count Sets the current render count
    */
    set RenderSpeed(Count) {
        if (Count) {
            this.RenderRate = Count;
        }
        else {
            console.log("Cannot set the render rate to: " + Count);
        }
    }
    /**
    * Set the text width
    * @param {Integer} Width Sets the text width to apply to created text elements
    */
    set SetTextWidth(Width) {
        if (Width) {
            this.TextWidth = Width;
        }
        else {
            console.log("Text width not defined in SetTextWidth(Try using an integer value)");
        }
    }
    /**
    * Set the line height
    * @param {Integer} Height Sets the default line height to be applied to text elements
    */
    set SetLineHeight(Height) {
        if (Height) {
            this.LineHeight = Height;
        }
        else {
            console.log("Line height not defined in SetLineHeight(Try using an integer value)");
        }
    }
    /**
    * Set the element screen resolution
    * @param {Integer[]} Resolution Sets the resolution of the canvas element
    */
    set Resolution(Resolution) {
        if (Resolution.length == 2) {
            this.Res = Resolution;
        }
        else {
            console.log("Cannot set screen" + this.ID + "to resolution" + Resolution + "requires x/y integer array");
        }
    }
    /**
    * Set Timeout
    * @param {Array[]} DOMArray Updates the screen DOM
    */
    set DOM(DOMArray) {
        this.DOMArray = DOMArray;
    }
    /**
    * Sets whether to render this screen during the screenmap render cycle
    * @param {Boolean} Flag A boolean value indicating either true(Render) or false(do not render)
    */
    set Render(Flag) {
        if (Flag) {
            this.RenderFlag = Flag;
        }
        else {
            console.log("Render must be either true or false");
        }
    }
    //----------------------------------------------------------GET METHODS-------------------------------
    /**
    * Gets the unique screen ID
    * @returns {Number} The unique screen ID
    */
    get GetID() {
        return (Number(this.ID));
    }
    /**
    * Gets the current render count
    * @returns {Number} The current render count
    */
    get GetRenderSpeed() {
        return (Number(this.RenderRate));
    }
    /**
    * Gets the current render count
    * @returns {Boolean} The current render state(true:on, false:off)
    */
    get GetRenderState() {
        return (Boolean(this.RenderFlag));
    }
    //-----------------------------------------------------------PUBLIC INTERFACE---------------------------------
    /**
    * Function to add an item to the render DOM
    * @param {number[]} Origin Origin x/y of the upper left corner of the drawable
    * @param {number[]} Dimensions where to draw the sprite in an x/y number array
    * @param {string} Image Name of the sprite to use
    * @param {string} Type type of the sprite to use(Sprite|Text|Background)
    */
    Draw(Origin, Dimensions, Image, Type, Font, FillStyle, Text) {
        //this.bctx.drawImage(Sprite, xcord, ycord, width, height);
        let Item = { dimensions: Dimensions, fillstyle: FillStyle, font: Font, image: Image, origin: Origin, type: Type, text: Text };
        this.DOMArray.push(Item);
    }
    /**
    * Function to render the map to the background canvas and blit
    */
    RenderDOM() {
        //Render Backgrounds First
        for (let i of this.DOMArray) {
            if (i.type == "Background") {
                //0=Image 1=Origin 2=Dimensions 3=Type
                this.bctx.drawImage(i.image, i.origin[0], i.origin[1], i.dimensions[0], i.dimensions[1]);
            }
        }
        //Render Sprites Next
        for (let i of this.DOMArray) {
            if (i.type == "Sprite") {
                //0=Image 1=Origin 2=Dimensions 3=Type
                this.bctx.drawImage(i.image, i.origin[0], i.origin[1], i.dimensions[0], i.dimensions[1]);
            }
        }
        //Render Text Last
        for (let i of this.DOMArray) {
            if (i.type == "Text") {
                this.bctx.fillStyle = i.fillstyle;
                this.bctx.font = i.font;
                this.ctx.fillStyle = i.fillstyle;
                this.ctx.font = i.font;
                this.WrapText(this.bctx, i.text, i.origin[0], i.origin[1], i.dimensions[0], i.dimensions[1]);
            }
        }
        //Refresh the screen
        this.Blit();
    }
    //-----------------------------------------------------------INTERNAL METHODS----------------------------------   
    /**
    * Function to resize the canvas and zoom elements to fit the window maintains aspect ratio
    * @param {Array} PageDimensions Array of XY corresponding to the pages native pixel dimensions
    * @param {Array} WindowDimensions Array of XY corresponding to the current window dimensions
    */
    ScaleCanvas(PageDimensions, WindowDimensions) {
        //------------------------------------------------------FULL SCREEN MODE ONLY SO FAR-------------------------	
        //Save the canvas before performing transformation
        this.ctx.save();
        this.bctx.save();
        //if the upper left is 0,0
        var ratiox = (WindowDimensions[0] * 100) / PageDimensions[0]; //WindowDimensions[0] - PageDimensions[0];
        var ratioy = (WindowDimensions[1] * 100) / PageDimensions[1];
        ratioy = +ratioy.toFixed(2);
        ratiox = +ratiox.toFixed(2);
        ratioy = ratioy / 100;
        ratiox = 75.57 / 100;
        //if were not scaled correctly	
        if (ratiox != 100 || ratioy != 100) {
            this.ctx.scale(.50, .50);
            this.bctx.scale(.50, .50);
        }
        this.ctx.restore();
        this.bctx.restore();
        //--------------Implement a write text to screen function that can dynamically change the font position or size
    }
    /**
    * Clears the current screen (not needed with blitting)
    */
    Clear() {
        //--------------------------------------!!WARNING DEBUG MODE-------------------------------------------------------
        //Clear does not properly clear the defined resolution using the single command below
        //this.bctx.clearRect(0, 0, this.XResolution, this.YResolution);
        this.bctx.clearRect(0, 0, 3000, 3000);
    }
    /**
    * Function to wrap the loaded text
    * @param {CanvasContext} context the current Canvas context to display to
    * @param {String} text The text to display within the DOM element
    * @param {Integer} x The starting x position in pixels
    * @param {Integer} y The starting y position in pixels
    * @param {Integer} maxWidth The maximum width to use before wrap
    * @param {Integer} lineHeight The height of the display text
    */
    WrapText(context, text, x, y, maxWidth, lineHeight) {
        /*var words = text.split(' ');
        var line = '';
        for(var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);*/
        context.textAlign = "start";
        context.fillText(text, x, y);
    }
}


/***/ }),

/***/ "./src/ScreenMap.js":
/*!**************************!*\
  !*** ./src/ScreenMap.js ***!
  \**************************/
/*! exports provided: ScreenMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScreenMap", function() { return ScreenMap; });
/* harmony import */ var _SMScreen__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SMScreen */ "./src/SMScreen.js");
/*----------------------------------------------------------------------------------------------------------
::“Copyright 2018 Clayton Burnett”
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the implementation for the Canvas controller
 *
 * @author Clayton Burnett <the82professional@hotmail.com>
 */
/**
 * ###############################################################################################################
 *                                              ScreenMap
 */
/**
 * @class
 * Class modeling a Multi-Canvas controller
 *
 * @description
 * This is the canvas manager. When passing in canvas DOM elements pass them in the order: front1, back1, front2, back2 etc.
 * The rear rear canvas element will be written to and then "blitted" to the front canvas.
 **/

/**
* @constructor
*/
class ScreenMap {
    constructor(CVChannels) {
        this.GlobalXResolution = 300; //Screen resolution X value in integer format
        this.GlobalYResolution = 150; //Screen resolution Y value in integer format
        this.GlobalStyle = "12px Arial";
        this.GlobalFont = 'blue';
        this.ZoomLevel = 1; //Current screen magnification level 
        this.WindowHeight = window.innerHeight;
        this.WindowWidth = window.innerWidth;
        this.Channels = CVChannels;
        this.Screens = [];
        this.GlobalRefreshLimit = 60;
        this.CycleCount = 0;
        //Run on init function
        this.Init();
    }
    //----------------------------------------------SET METHODS--------------------------------------------------
    /**
    * Sets the default global canvas resolution for all managed canvases
    * @param {Integer[]} Pair An instance of a x[0] and y[1] integer array indicating a resolution
    */
    set SetGlobalResolution(Pair) {
        if (Pair && Pair.length > 1) {
            this.GlobalXResolution = Pair[0];
            this.GlobalYResolution = Pair[1];
        }
    }
    /**
    * Sets the default global style applied to screen text elements
    * @param {String} Style A ctx.fillstyle string
    */
    set SetGlobalStyle(Style) {
        if (Style) {
            this.GlobalStyle = Style;
        }
    }
    /**
    * Sets the default global font applied to screen text elements
    * @param {String} Font A ctx.font string
    */
    set SetGlobalFont(Font) {
        if (Font) {
            this.GlobalFont = Font;
        }
    }
    //----------------------------------------------GET METHODS(NONE)-------------------------------------------------
    //----------------------------------------------PUBLIC INTERFACE--------------------------------------------------
    /**
       * Function to write text to a screen
       * @param {Integer} Screen The canvas pair to render to
       * @param {String} Text The text to display
       * @param {Integer} x The starting x position in pixels
       * @param {Integer} y The starting y position in pixels
       * @param {Integer} Width The maximum width to use
       * @param {Integer} Height The height of the display text
       * @param {ImageBitmap} Pic Optional picture representation
       */
    WriteText(Screen, Text, xOrigin, yOrigin, Width, Height, Pic) {
        if (Screen >= 0) {
            //Origin, Dimensions, Image, Type, Font, FillStyle, Text
            this.Screens[Screen].Draw(new Array(xOrigin, yOrigin), new Array(Width, Height), Pic, "Text", this.GlobalFont, this.GlobalStyle, Text);
        }
    }
    /**
    * Internal function that is run each render cycle
    */
    RenderCycle() {
        if (this.CycleCount < this.GlobalRefreshLimit) {
            this.CycleCount++; //Increment the cycle counter
            //Run screen updates
            for (let i of this.Screens) {
                if (i.GetRenderSpeed <= this.CycleCount && i.GetRenderState == true) {
                    i.RenderDOM();
                }
            }
        }
        else {
            //Reset the cycle counter
            this.CycleCount = 0;
        }
    }
    //----------------------------------------------PRIVATE MEMBER FUNCTIONS------------------------------------------
    /**
    * private ScreenMap initialization function, does not take parameters
    */
    Init() {
        //Create Screen objects for each pair
        let oddeven = 0;
        let ctxArray = new Array();
        let bctxArray = new Array();
        //Split up the channels
        for (let i of this.Channels) {
            if (oddeven == 0) {
                ctxArray.push(i);
                oddeven = 1;
            }
            else {
                bctxArray.push(i);
                oddeven = 0;
            }
        }
        for (let i in ctxArray) {
            this.Screens.push(new _SMScreen__WEBPACK_IMPORTED_MODULE_0__["SMScreen"]([ctxArray[i], bctxArray[i]], new Array(this.GlobalXResolution, this.GlobalYResolution), Number(i)));
        }
    }
}


/***/ })

/******/ });
});
//# sourceMappingURL=ScreenMap.js.map