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

export class SMScreen{
    private RenderFlag: boolean;    //Flag indicating whether this object should be processed during a render cycle
    private ctx: CanvasRenderingContext2D;  //2D rendering context of the managed front canvas 
    private bctx: CanvasRenderingContext2D; //2D rendering context of the managed rear canvas
    private Res:  number[];                 //object window integer resolution x/y
    private DOMArray: DOMItem[];  //Array of current DOM objects to process
    private DITEM: DOMItem;
    private RenderRate: number;             //Local render speed eg. 1=realtime 2=every 2 cycles
    private BackgroundImages: string[];     //The Current array of background Images
    private TextWidth: number;              //The width of the text within the element
    private LineHeight: number;             //The text line height
    private eooFlag: boolean;

    constructor(readonly Canvas: HTMLCanvasElement[], readonly IniRes: number[], readonly ID: number){
        //Default Constructor
        this.Res = IniRes;
        this.DOMArray = new Array();
        this.ID = ID;
        this.RenderFlag = true;
        this.RenderRate = 0; //Used internally to calculate refresh
        this.BackgroundImages = new Array(); //The Current array of background Images
        this.eooFlag=true;
        if(Canvas){
            for(let i of Canvas){
                if(this.eooFlag == true){
                    this.ctx = i.getContext('2d');
                    this.eooFlag = false;
                }else{
                    this.bctx = i.getContext('2d');
                    this.eooFlag = true;
                }
            }
        }
    }
    //-------------------------------------------------------------SET METHODS---------------------------
    /**
    * Set the element screen resolution
    * @param {Integer[]} Resol Sets the screen resolution
    */
    set Resolut(Resol: number[]){
    if(Resol && Resol.length > 0){
        this.Res = Resol;
    }else{
        console.log("Cannot set the resolution: " + Resol);
    }
}
    /**
    * Set the text width
    * @param {Integer} Width Sets the text width to apply to created text elements
    */
   set SetTextWidth(Width: number){
     if(Width){
          this.TextWidth = Width;
        }else{
           console.log("Text width not defined in SetTextWidth(Try using an integer value)");
        }
    }
    /**
    * Set the line height
    * @param {Integer} Height Sets the default line height to be applied to text elements
    */
   set SetLineHeight(Height: number){
    if(Height){
         this.LineHeight = Height;
       }else{
          console.log("Line height not defined in SetLineHeight(Try using an integer value)");
       }
   }
    /**
    * Set the element screen resolution
    * @param {Integer[]} Resolution Sets the resolution of the canvas element
    */
    set Resolution(Resolution: number[]){
        if(Resolution.length == 2){
           this.Res = Resolution;
        }else{
            console.log("Cannot set screen" + this.ID + "to resolution" + Resolution + "requires x/y integer array");
        }
    }
    /**
    * Set Timeout
    * @param {Array[]} DOMArray Updates the screen DOM
    */
    set DOM(DOMArray: DOMItem[]){
            this.DOMArray = DOMArray;
    }
    /**
    * Sets whether to render this screen during the screenmap render cycle
    * @param {Boolean} Flag A boolean value indicating either true(Render) or false(do not render)
    */
    set Render(Flag: boolean){
        if(Flag){
            this.RenderFlag = Flag;
        }else{
            console.log("Render must be either true or false");
        }
    }
    //----------------------------------------------------------GET METHODS-------------------------------
    /**
    * Gets the unique screen ID 
    * @returns {Number} The unique screen ID
    */
    get GetID(){
        return(Number(this.ID));
    }
    /**
    * Gets the current render count 
    * @returns {Number} The current render count
    */
    get GetRenderSpeed(){
        return(Number(this.RenderRate));
    }
    /**
    * Gets the current render count 
    * @returns {Boolean} The current render state(true:on, false:off)
    */
    get GetRenderState(){
        return(Boolean(this.RenderFlag));
    }
    //-----------------------------------------------------------PUBLIC INTERFACE---------------------------------
    /**
    * Function to add an item to the render DOM
    * @param {number[]} Origin Origin x/y of the upper left corner of the drawable
    * @param {number[]} Dimensions where to draw the sprite in an x/y number array
    * @param {string} Image Name of the sprite to use
    * @param {string} Type type of the sprite to use(Sprite|Text|Background)
    */
    public Draw(Origin: number[],Dimensions: number[], Image: ImageBitmap, Type: string, Font: string, FillStyle: string, Text: string){
            //this.bctx.drawImage(Sprite, xcord, ycord, width, height);
            let Item: DOMItem = {dimensions: Dimensions, fillstyle: FillStyle, font: Font, image: Image, origin: Origin, type: Type, text: Text};
            this.DOMArray.push(Item);   
   }
     /**
    * Function to test whether the indicated point intersects with a DOM item and return the matches
    * @param {Integer[]} Point The point to test each item against
    * @param {Integer} Radius (optional)The Pixel radius centered at Point
    * @returns {String[]} An array of name strings for each item
    */
   public ReturnIntersect(Point: number[], Radius?: number){
    let Matches = new Array();
    if(Radius)
    {let PRad = Radius;}
    else
    {let PRad = 0;}
    for(let i of this.DOMArray){
        let cond1 = (Point[0] > i.origin[0] + i.dimensions[0]);
        let cond2 = (Point[0] + Radius < i.dimensions[0]);
        let cond3 = (Point[1] > i.origin[1] + i.dimensions[1]);
        let cond4 = (Point[1] + Radius < i.origin[1]);
        if(!(cond1 || cond2 || cond3 || cond4)){
            Matches.push(i.text);
        }
    }
    return(Matches);
}
/**
* Function to render the map to the background canvas and blit
*/
public RenderDOM(){
    //Render Backgrounds First
    for(let i of this.DOMArray){
        if(i.type == "Background"){
            //0=Image 1=Origin 2=Dimensions 3=Type
            this.bctx.drawImage(i.image, i.origin[0], i.origin[1], i.dimensions[0], i.dimensions[1]);
        }
    }
    //Render Sprites Next
    for(let i of this.DOMArray){
        if(i.type == "Sprite"){
            //0=Image 1=Origin 2=Dimensions 3=Type
            this.bctx.drawImage(i.image, i.origin[0], i.origin[1], i.dimensions[0], i.dimensions[1]);
        }
    }
     //Render Text Last
     for(let i of this.DOMArray){
        if(i.type == "Text"){
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
/**
* Function to clear the DOM
*/
public ClearDOM(){
    this.DOMArray = new Array();
    this.Clear();
}
/**
* Function to clear the DOM by ID
*/
public ClearID(){
    this.DOMArray = new Array();
    this.Clear();
}
//-----------------------------------------------------------INTERNAL METHODS----------------------------------   
   

    
    
    
    /**
    * Function to resize the canvas and zoom elements to fit the window maintains aspect ratio
    * @param {Array} PageDimensions Array of XY corresponding to the pages native pixel dimensions
    * @param {Array} WindowDimensions Array of XY corresponding to the current window dimensions
    */
    private ScaleCanvas(PageDimensions, WindowDimensions) {
	    //------------------------------------------------------FULL SCREEN MODE ONLY SO FAR-------------------------	
	    //Save the canvas before performing transformation
	    this.ctx.save();
	    this.bctx.save();
	    //if the upper left is 0,0
	    var ratiox = (WindowDimensions[0] * 100) / PageDimensions[0] ;//WindowDimensions[0] - PageDimensions[0];
	    var ratioy = (WindowDimensions[1] * 100) / PageDimensions[1];
	    ratioy = +ratioy.toFixed(2);
	    ratiox = +ratiox.toFixed(2);
	    ratioy = ratioy / 100;
	    ratiox = 75.57 / 100;
	    //if were not scaled correctly	
	    if(ratiox != 100 || ratioy != 100){
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
    private Clear(){
	    //--------------------------------------!!WARNING DEBUG MODE-------------------------------------------------------
	    //Clear does not properly clear the defined resolution using the single command below
	    //this.bctx.clearRect(0, 0, this.XResolution, this.YResolution);
	    this.bctx.clearRect(0, 0, 3000, 3000);
    }
    /**
    * Function to flip the displayed screens by swapping video buffer
    */
    private Blit = function(){
	    if(this.bctx && this.ctx){
		    var offscreen_data = this.bctx.getImageData(0, 0, this.Res[0], this.Res[1]);
		    this.ctx.putImageData(offscreen_data, 0, 0);
	    }
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
    private WrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number){
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
//Declaration for the DOMItem type
export interface DOMItem{
    image: ImageBitmap;
    origin: number[];
    dimensions: number[];
    type: string;
    fillstyle: string; 
    font: string;
    text: string;
}