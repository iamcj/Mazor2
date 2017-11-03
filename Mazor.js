// Date: 2017
// Auteur:Corjan van Uffelen
var mazorManager;
var timer;
var states = {DEACTIVATED:1, ACTIVATED:2, ACTIVATEDCLOSABLE:3, ZOOMACTIVATED:4,PANACTIVATED:5,FULLPANMODEACTIVATED:6};

//settings
var timeOutms = 500;
var cursorBallRadius = 3.5; 

// Start Mazor
function init(){
  mazorManager = new MazorManager();
}

//Model class
function Mouse(){

}

	// To show mazor on first move
	Mouse.prototype.init = function(){
		document.addEventListener('mousemove', onMouseUpdateInit, false);
	}

	// To show mazor on first move
	function onMouseUpdateInit(e) {
		mazorManager.init(e.pageX,e.pageY);
		document.removeEventListener('mousemove', onMouseUpdateInit, false);
		document.addEventListener('mousemove', onMouseUpdate, false);
	}

	// For the rest of the moving
	function onMouseUpdate(e) {
		position = new Point(e.pageX,e.pageY);
		mazorManager.updatePosition(position);
	}

//View Class
function Canvas(){
	this.map;
	this.setHeight();
	this.loadMaps();
}

	//set Height of Canvas
	Canvas.prototype.setHeight = function(){
		var h = window.innerHeight - 19 ;
		document.getElementById('Wrapper').setAttribute("style","height:" + h + "px");
	}

	//set Height of Canvas
	Canvas.prototype.loadMaps = function(){
		var latLng = new google.maps.LatLng(52.28958, 5.39524);

		this.map = new google.maps.Map(document.getElementById('Canvas'), {
		zoom: 8,
		center: latLng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		gestureHandling: 'none',
		zoomControl: false
		});
	}

	//Zoom 
	//Based  on the current centerpoint, you can define a min and max bound of min and max zoom level.
	Canvas.prototype.zoom = function(percentage){
		var markerBounds = new google.maps.LatLngBounds();
		   var randomPoint, i;

	   for (i = 0; i < 10; i++) {
		 // Generate 10 random points within North East USA
		 randomPoint = new google.maps.LatLng( 39.00 + (Math.random() - 0.5) * 20, 
											  -77.00 + (Math.random() - 0.5) * 20);
		markerBounds.extend(randomPoint);
	   }
		
		this.map.fitBounds(markerBounds);

	}

	//Pan
	Canvas.prototype.pan = function(direction,speed){
		var center = new google.maps.LatLng(-50, -50);
		this.map.panTo(center);
	}

//Controller class
function MazorManager(){
	this.canvas = new Canvas();
	this.mazor = new Mazor();
	this.mouse = new Mouse();
	this.mouse.init();
}

	MazorManager.prototype.init = function(position){
		this.mazor.init();
		this.mazor.updatePosition(position);
	}

	//StateManagement
	MazorManager.prototype.updatePosition = function(position){
		
		if(this.mazor.isDeActivated()){
			this.checkToActivate(position);
		} else if (this.mazor.isActivated()){
			this.checkToClosable(position);
		} else if (this.mazor.isActivatedClosable()){
			this.checkToClose(position);
		} else if (this.mazor.isZoomActivated()){
			
		} else if (this.mazor.isPanActivated()){
			
		} else if (this.mazor.isFullPanModeActivated()){
			
		}
		this.mazor.updatePosition(position);
	}

	MazorManager.prototype.checkToActivate = function(position){
		clearTimeout(timer);
		var t = this;
		timer = window.setTimeout(function(){t.mazor.activateMazor();},timeOutms);
	}

	MazorManager.prototype.checkToClosable = function(position){
		//The mouse has to have left the center.
		if(this.mazor.origin.calcDistance(position)> cursorBallRadius){
			this.mazor.activateMazorClosable();
		}
	}
	
	MazorManager.prototype.checkToClose = function(position){
		//Check if the cursor is near the center;
		if(this.mazor.origin.calcDistance(position)< cursorBallRadius-1){
			this.mazor.deActivateMazor();
		}
	}
	
	

//Start of Mazor
function Mazor(){
	this.state;
	this.origin;
	this.cursorBall = new CursorBall();
	this.MazorDeActivated = new MazorDeActivated();
}

	//Only move the circels if not activated.
	Mazor.prototype.updatePosition = function(position){
		if (this.isDeActivated()){
			this.origin = position;
			this.MazorDeActivated.updatePosition(position);
		} else {
		//update ball
			this.cursorBall.updatePosition(position);
		}
	}

	Mazor.prototype.init = function(){
		this.state = states.DEACTIVATED;
		this.MazorDeActivated.show();
	}
	
	Mazor.prototype.activateMazor = function(){
		this.state = states.ACTIVATED;
		this.MazorDeActivated.hide();
		this.cursorBall.show();
		this.cursorBall.setPosition(this.origin);
	}
	
	Mazor.prototype.activateMazorClosable = function(){
		this.state = states.ACTIVATEDCLOSABLE;
	}
	
	
	Mazor.prototype.deActivateMazor = function(){
		this.state = states.DEACTIVATED;
		this.cursorBall.hide();
	}
	
	Mazor.prototype.isActivated = function(){
		return (this.state == states.ACTIVATED);
	}
	
	Mazor.prototype.isActivatedClosable = function(){
		return (this.state == states.ACTIVATEDCLOSABLE);
	}

	Mazor.prototype.isDeActivated = function(){
		return (this.state == states.DEACTIVATED);
	}	
	
	Mazor.prototype.isZoomActivated = function(){
		return (this.state == states.ZOOMACTIVATED);
	}	

	Mazor.prototype.isPanActivated = function(){
		return (this.state == states.PANACTIVATED);
	}	

	Mazor.prototype.isFullPanModeActivated = function(){
		return (this.state == states.FULLPANMODEACTIVATED);
	}	


function Element(){
	this.div;
	this.activated = false;
	this.visible = false;
	this.origin;
}

	Element.prototype.updatePosition = function(position){
		if (this.visible) {
			this.origin = position;
			this.setPosition(position);
		}
					
	}

	// take half of the size into account to position the element
	Element.prototype.setPosition = function(position){
		var left = position.x - (this.div.offsetWidth /2);
		var top = position.y - (this.div.offsetHeight /2);
		this.div.style.left = left+'px';
		this.div.style.top = top+'px';
	}
	
	Element.prototype.setOrigin = function(position){
		this.origin = position;
	}

	Element.prototype.activate = function(){
		this.activated = true;
		this.show();
	}
	
	Element.prototype.setDiv = function(divName){
		this.div = document.getElementById(divName);
	}
	
	Element.prototype.show = function(){
		this.visible = true;
		this.div.setAttribute("style","visibility:visible");
	}
	
	Element.prototype.hide = function(){
		this.visible = false;
		this.div.setAttribute("style","visibility:hidden");
	}

function CursorBall(){
	this.setDiv('CursorBall');	
}

//CursorBall.prototype = Object.create(Element.prototype);
//CursorBall.prototype.constructor = Element;
CursorBall.prototype = new Element();

function InnerCircle(){
	this.setDiv('InnerCircle');	
}

//InnerCircle.prototype = Object.create(Element.prototype);
//InnerCircle.prototype.constructor = Element;
InnerCircle.prototype = new Element();

MazorDeActivated.prototype = new Element();

function MazorDeActivated(){
	this.setDiv('MazorDeActivated');	
}

//InnerCircle.prototype = Object.create(Element.prototype);
//InnerCircle.prototype.constructor = Element;
InnerCircle.prototype = new Element();


function OuterCircle(){
	this.setDiv('OuterCircle');	
}

//OuterCircle.prototype = Object.create(Element.prototype);
//OuterCircle.prototype.constructor = Element;
OuterCircle.prototype = new Element();

function Zoom(){
	this.min = 1;
	this.max = 22;
	this.origin = new Point();
}

//Helper classes and functions
function Point(px,py){
	this.x = px;
	this.y = py;
}

	//Calculate distance between the point and another points
	Point.prototype.calcDistance = function(toPoint){
		var x = Math.abs(this.x - toPoint.x);
		var y = Math.abs(this.y - toPoint.y);
		var d = Math.sqrt( x*x + y*y);
		return d;
	}

	//Compare to other point
	Point.prototype.compare = function(toPoint){
		if (this.x == toPoint.x && this.y == toPoint.y){
			return true;
		} else {
			return false;
		}
	}

//Radians
function rad(x) {
  return x * Math.PI / 180;
}



