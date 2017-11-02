// Date: 2017
// Auteur:Corjan van Uffelen
var mazorManager;

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
		mazorManager.updatePosition(e.pageX,e.pageY);
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
	this.origin = new Point();
	this.previousPosition = new Point();
	this.activated = false;
}

	MazorManager.prototype.init = function(px,py){
		this.origin.x = px;
		this.origin.y = py;
		this.mazor.init();
		this.mazor.updatePosition(px,py);
	}

	MazorManager.prototype.updatePosition = function(px,py){
		this.origin.x = px;
		this.origin.y = py;
		this.comparePosition();
		this.mazor.updatePosition(px,py);
	}

	MazorManager.prototype.comparePosition = function(){
		if (this.origin.compare(this.previousPosition)){
			this.activateMazor();
		} else {
			this.previousPosition = this.origin;
		}
	}

	MazorManager.prototype.activateMazor = function(){
		this.activated = true;
		this.mazor.activated = true;
		this.mazor.setOrigin(this.origin.x, this.origin.y);
	}

	MazorManager.prototype.deActivateMazor = function(){
		this.activated = false;
		this.mazor.deActivateMazor();
	}

//Start of Mazor
function Mazor(){
	this.activated=false;
	this.origin = new Point();
	this.cursorBall = new CursorBall();
	this.MazorDeActivated = new MazorDeActivated();
}

	//Only move the circels if not activated.
	Mazor.prototype.updatePosition = function(px,py){
		if (this.activated==false){
			this.origin.x = px;
			this.origin.y = py;
			this.MazorDeActivated.updatePosition(px,py);
		}
		//update ball
		this.cursorBall.updatePosition();
		
	}

	Mazor.prototype.setOrigin = function(px,py){
		this.origin.x = px;
		this.origin.y = py;
	}
	
	Mazor.prototype.init = function(){
		this.MazorDeActivated.show();
	}

function Element(){
	this.div;
	this.activated = false;
	this.visible = false;
	this.origin = new Point();
}

	Element.prototype.updatePosition = function(px,py){
		if (this.visible) {
			this.origin.x = px;
			this.origin.y = py;
			this.setPosition(px,py);
		}
					
	}

	// take half of the size into account to position the element
	Element.prototype.setPosition = function(x,y){
		var left = x - (this.div.offsetWidth /2);
		var top = y - (this.div.offsetHeight /2);
		this.div.style.left = left+'px';
		this.div.style.top = top+'px';
	}
	
	Element.prototype.setOrigin = function(px,py){
		this.origin.x = px;
		this.origin.y = py;
	}

	Element.prototype.activate = function(){
		this.activated = true;
		this.show;
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
function Point(){
	this.x = 0;
	this.y = 0;
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



