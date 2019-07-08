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
import {SMScreen} from './SMScreen';

 /**
 * @constructor
 */
export class ScreenMap{

	private Screens: SMScreen[];		//The array of managed screens
	private GlobalXResolution: number; 	//Global Screen resolution X value in integer format
	private GlobalYResolution: number; 	//Global Screen resolution Y value in integer format
	private GlobalRefreshLimit: number; //Screens cannot refresh slower than this many cycles eg. 2 means refresh once every 2 cycles
	private ZoomLevel: number;			//Current screen magnification level 
	private WindowHeight: number;		//Height pulled from the window object
	private WindowWidth: number;		//Width pulled from the window object
	private Channels: NodeListOf<HTMLCanvasElement>;	//Unsorted container of page canvas elements(including rear canvases)
	private CycleCount: number; //The Rendering cycle counter

    constructor(CVChannels?: NodeListOf<HTMLCanvasElement>){
	this.GlobalXResolution = 0; //Screen resolution X value in integer format
	this.GlobalYResolution = 0; //Screen resolution Y value in integer format
	this.ZoomLevel = 1;		//Current screen magnification level 
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
set SetGlobalResolution(Pair: number[]){
    if(Pair && Pair.length > 1){
    this.GlobalXResolution = Pair[0];
    this.GlobalYResolution = Pair[1];
    }
}
//----------------------------------------------GET METHODS(NONE)-------------------------------------------------
//----------------------------------------------PUBLIC INTERFACE--------------------------------------------------
/**
* Internal function that is run each render cycle
*/
public RenderCycle() {
	if(this.CycleCount < this.GlobalRefreshLimit){
	this.CycleCount++; //Increment the cycle counter
	//Run screen updates
	for(let i of this.Screens){
		if(i.GetRenderSpeed <= this.CycleCount && i.GetRenderState == true){
			i.RenderDOM(); 
		}
	}
	}else{
		//Reset the cycle counter
		this.CycleCount = 0;
	}
}


//----------------------------------------------PRIVATE MEMBER FUNCTIONS------------------------------------------
/**
* private ScreenMap initialization function, does not take parameters
*/
private Init() {
	//Create Screen objects for each pair
	let oddeven = 0;
	let ctxArray = [];
	let bctxArray = [];
	//Split up the channels
	for(let i of this.Channels){
		if(oddeven == 0){
			ctxArray.push(i);
			oddeven = 1;
		}else{
			bctxArray.push(i);
			oddeven = 0;
		}
	}
	for(let i in ctxArray){
		this.Screens.push(new SMScreen([ctxArray[i], bctxArray[i]], [100, 100], Number(i)));
	}
}
}