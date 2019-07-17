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
import { SMScreen } from './SMScreen';
/**
* @constructor
*/
export class ScreenMap {
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
            for (let i of this.Screens) {
                i.Resolut = [this.GlobalXResolution, this.GlobalYResolution];
            }
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
    * Function to write a background layer into the scene
    * @param {Integer} Screen The canvas pair to render to
    * @param {Integer} x The starting x position in pixels
    * @param {Integer} y The starting y position in pixels
    * @param {Integer} Width The width of the background
    * @param {Integer} Height The height of the background
    * @param {ImageBitmap} Pic Optional picture representation
    */
    WriteBackground(Screen, xOrigin, yOrigin, Width, Height, Pic) {
        if (Screen >= 0) {
            //Origin, Dimensions, Image, Type, Font, FillStyle, Text
            this.Screens[Screen].Draw(new Array(xOrigin, yOrigin), new Array(Width, Height), Pic, "Background", this.GlobalFont, this.GlobalStyle, "");
        }
    }
    /**
    * Function to write a background layer into the scene
    * @param {Integer} Screen The canvas pair to render to
    * @param {Integer} x The starting x position in pixels
    * @param {Integer} y The starting y position in pixels
    * @param {Integer} Width The width of the Image
    * @param {Integer} Height The height of the Image
    * @param {ImageBitmap} Pic Optional picture representation
    */
    WriteSprite(Screen, xOrigin, yOrigin, Width, Height, Pic) {
        if (Screen >= 0) {
            //Origin, Dimensions, Image, Type, Font, FillStyle, Text
            this.Screens[Screen].Draw(new Array(xOrigin, yOrigin), new Array(Width, Height), Pic, "Sprite", this.GlobalFont, this.GlobalStyle, "");
        }
    }
    /**
        * Function to write a background layer into the scene
        * @param {Integer} Screen The screen to clear
        */
    ClearScreen(Screen) {
        if (Screen >= 0) {
            //Origin, Dimensions, Image, Type, Font, FillStyle, Text
            this.Screens[Screen].ClearDOM();
        }
    }
    /**
        * Function to detect which element or elements exist at the coordinates indicated
        * @param {Integer} Screen The screen to detect on
        * @returns {String[]} A string array of detected elements
        */
    ClickDetect(Screen, Coordinates) {
        if (Screen >= 0 && Number.length == 2) {
            let TestScreen = this.Screens[Screen];
            let Collisions = TestScreen.ReturnIntersect(Coordinates);
            return (Collisions);
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
            this.Screens.push(new SMScreen([ctxArray[i], bctxArray[i]], new Array(this.GlobalXResolution, this.GlobalYResolution), Number(i)));
        }
    }
}
