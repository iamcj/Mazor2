// Date: 2017
// Auteur:Corjan van Uffelen
var mazorManager;
var timer;
var states = {DEACTIVATED:1, ACTIVATED:2, ACTIVATEDCLOSABLE:3, ZOOMACTIVATED:4,PANACTIVATED:5,FULLPANMODEACTIVATED:6};

//settings
var timeOutms = 400;
var cursorBallRadius = 4.5; 
var closeRadius = 70;
var panIconOffset = 57;
var zoomIconOffset = 36;

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
			this.checkToHighlightZoom(position);
		} else if (this.mazor.isActivatedClosable()){
			this.checkToClose(position);
			this.checkToHighlightZoom(position);
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
	
	MazorManager.prototype.checkToHighlightZoom = function(position){
		if(this.mazor.zoomIcon.getRealPosition().calcDistance(position) < cursorBallRadius*3){
			this.mazor.highlightZoom();
		} else {
			this.mazor.notHighlightZoom();
		}
	}
	
	MazorManager.prototype.checkToClose = function(position){
		//Check if the cursor is near the center;
		if(this.mazor.origin.calcDistance(position)< cursorBallRadius){
			this.mazor.deActivateMazor();
		} else if(this.mazor.origin.calcDistance(position)> closeRadius){
			this.mazor.deActivateMazor();
		}
	}
	
	

//Start of Mazor
function Mazor(){
	this.state;
	this.origin;
	this.cursorBall = new CursorBall();
	this.MazorDeActivated = new MazorDeActivated();
	this.innerCircle = new InnerCircle();
	this.outerCircle = new OuterCircle();
	this.close = new Close();
	this.panIcon = new PanIcon();
	this.panIconImage = new PanIconImage();
	this.zoomIcon = new ZoomIcon();
}

	//Only move the circels if not activated.
	Mazor.prototype.updatePosition = function(position){
		if (this.isDeActivated()){
			this.origin = position;
			this.MazorDeActivated.updatePosition(position);
		} else {
			this.cursorBall.updatePosition(position);
			this.innerCircle.rotate(this.origin.calcAngle(position)+180);
			this.outerCircle.rotate(this.origin.calcAngle(position)+180);
			this.panIcon.rotateIcon(this.origin.calcAngle(position));
			this.zoomIcon.rotateIcon(this.origin.calcAngle(position));
			
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
		this.innerCircle.show();
		this.innerCircle.setPosition(this.origin);
		this.outerCircle.show();
		this.outerCircle.setPosition(this.origin);
		this.close.show();
		this.close.setPosition(this.origin);
		this.zoomIcon.show();
		this.zoomIcon.offset = zoomIconOffset;
		this.zoomIcon.setPosition(this.origin);
		this.zoomIcon.rotateIcon(-90);
		this.panIcon.show();
		this.panIcon.offset = panIconOffset;
		this.panIcon.setPosition(this.origin);
		this.panIcon.rotateIcon(-90);
		this.panIconImage.show();
			
	}
	
	Mazor.prototype.activateMazorClosable = function(){
		this.state = states.ACTIVATEDCLOSABLE;
	}
	
	Mazor.prototype.deActivateMazor = function(){
		this.state = states.DEACTIVATED;
		this.MazorDeActivated.show();
		this.cursorBall.hide();
		this.innerCircle.hide();
		this.outerCircle.hide();
		this.close.hide();
		this.panIcon.hide();
		this.zoomIcon.hide();
		this.panIconImage.hide();
	}
	
	Mazor.prototype.highlightZoom = function(){
			this.zoomIcon.highlightZoom();
	}
	
	Mazor.prototype.notHighlightZoom = function(){
			this.zoomIcon.notHighlightZoom();
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
	this.realPosition = new Point();
}

	Element.prototype.updatePosition = function(origin){
		this.origin = origin;
		this.setPosition(origin);				
	}

	// take half of the size into account to position the element
	Element.prototype.setPosition = function(origin){
		this.origin = origin;
		var left = origin.x - (this.div.offsetWidth /2);
		var top = origin.y - (this.div.offsetHeight /2);
		this.div.style.left = left+'px';
		this.div.style.top = top+'px';
	}
	
	Element.prototype.setOrigin = function(origin){
		this.origin = origin;
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
	
Element.prototype.rotate = function(deg){
		this.div.style.webkitTransform = 'rotate('+deg+'deg)'; 
		this.div.style.mozTransform    = 'rotate('+deg+'deg)'; 
		this.div.style.msTransform     = 'rotate('+deg+'deg)'; 
		this.div.style.transform       = 'rotate('+deg+'deg)'; 
	}

Element.prototype.rotateIcon = function(deg){
		this.rotate(deg);
		this.realPosition.x = this.origin.x + Math.cos(rad(deg)) * this.offset;
		this.realPosition.y = this.origin.y + Math.sin(rad(deg)) * this.offset;
		var left = this.realPosition.x - (this.div.offsetWidth /2);
		var top = this.realPosition.y - (this.div.offsetHeight /2);
		this.div.style.left = left+'px';
		this.div.style.top = top+'px';
	}


Element.prototype.getRealPosition = function(deg){
		return this.realPosition;
	}
	
CursorBall.prototype = new Element();
function CursorBall(){
	this.setDiv('CursorBall');	
}

InnerCircle.prototype = new Element();
function InnerCircle(){
	this.setDiv('InnerCircle');	
}

MazorDeActivated.prototype = new Element();
function MazorDeActivated(){
	this.setDiv('MazorDeActivated');	
}

OuterCircle.prototype = new Element();
function OuterCircle(){
	this.setDiv('OuterCircle');	
}

Close.prototype = new Element();
function Close(){
	this.setDiv('Close');	
}

PanIcon.prototype = new Element();
function PanIcon(){
	this.setDiv('PanIcon');
}

PanIconImage.prototype = new Element();
function PanIconImage(){
	this.setDiv('PanIconImage');
}

ZoomIcon.prototype = new Element();
function ZoomIcon(){
	this.setDiv('MagnifyingGlass');
}

ZoomIcon.prototype.highlightZoom = function(){
	document.documentElement.style.setProperty('--ZoomColor', 'var(--purple-color)');
}

ZoomIcon.prototype.notHighlightZoom = function(){
	document.documentElement.style.setProperty('--ZoomColor', 'var(--blue-color)');
}

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
	
	//Calculate distance between the point and another points
	Point.prototype.calcAngle = function(toPoint){
		var angleDeg = Math.atan2(toPoint.y - this.y, toPoint.x - this.x) * 180 / Math.PI;
		return angleDeg;
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



