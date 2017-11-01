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
	this.origin = new Point();
}


function Mazor(){
	this.origin = new Point();
}

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

//Radians
function rad(x) {
  return x * Math.PI / 180;
}



