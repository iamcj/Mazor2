// Date: 2017
// Auteur:Corjan van Uffelen
var mazorManager;
<<<<<<< HEAD
var disable=false;
var mouseLatLng;
=======
var timer;
var closeTimer;
var zoomTimer;
var zoomModeTimer;
var panTimer;
var panModeTimer;
var states = {DEACTIVATED:1, ACTIVATED:2, ACTIVATEDCLOSABLE:3, ZOOMACTIVATED:4, ZOOMMODEPLUS:6, ZOOMMODEMIN:7, PANACTIVATED:8,FULLPANMODEACTIVATED:9};
var mouseLatLng;
var previousPosition;
var mouseDifLat;
var mouseDifLng;
var zoomAngle;
var start=true;
var buttons= "<div class='spacer'></div><div class='Button' onclick='mazorManager.success()'>Het is me gelukt</div><div class='spacer'></div><div onclick='mazorManager.failed()' class='Button' >Het is me niet gelukt</div>"
var buttonsMazor= "<div class='spacer'></div><div class='Button' onclick='mazorManager.success()'>Het is me gelukt</div><div class='spacer'></div><div onclick='mazorManager.failed()' class='Button' >Het is me niet gelukt</div>"
var buttonEasyMouse= "<div class='spacer'></div><div class='Button' onclick='mazorManager.ratherMazor()'>Met een gewone muis was het sneller gegaan</div><div class='spacer'></div><div class='Button' onclick='mazorManager.ratherMouse()'>Met de Mazor is het sneller gegaan</div>"
var buttonEasyMazor= "<div class='spacer'></div><div class='Button' onclick='mazorManager.ratherMouse()'>Met de Mazor was het sneller gegaan</div><div class='spacer'></div><div class='Button' onclick='mazorManager.ratherMazor()'>Met de Muis is het sneller gegaan</div>"
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc

//settings
var timeOutms = 400;
var iconTimeOutms = 20;
var cursorBallRadius = 4.5; 
var closeRadius = 70;
var panIconOffset = 57;
var zoomIconOffset = 36;
var fullPanModeRadius = 70;
var zoomFactor = 10;
var zoomLevel = 5;
var zoomChange = 2;
var maxPanDistance = 170;
var panInterval = 10;
<<<<<<< HEAD
var panStep = 0.0004;
=======
var zoomModeInterval = 750;
var panStep = 0.001;
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
var i=0;
var oldDirection = 400;
var oldSpeed = -1;
var zoomIconMinAngle = 40;
var zoomIconPlusAngle = zoomIconMinAngle+3;

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
		document.addEventListener('keydown', onKeyDown, false);
		if (disable) {
			document.addEventListener('click', onMouseClickDisabled, false);
			document.addEventListener('wheel', onWheel, false);
		}	
	}
		
	Mouse.prototype.clickToActivate = function(){
		document.addEventListener('click', onMouseClick, false);
		document.addEventListener('wheel', onWheel, false);
	}

	function onKeyDown(e) {
		var zKey = 90;
		var mKey = 77;
		if(e.keyCode == zKey||e.keyCode == mKey) {

			if (mazorManager.isMazorDeActived()) {
				mazorManager.checkToActivate(previousPosition);
			} else {
				mazorManager.deActivateMazor(previousPosition);
				// put mazor at the place of the mouse
				mazorManager.updatePosition(previousPosition);
			}
		} 
	}
	
	// To show mazor on first move
	function onMouseUpdateInit(e) {
		mazorManager.init(e.pageX,e.pageY);
		mazorManager.previousPosition= new Point(e.pageX, e.pageY);
		document.removeEventListener('mousemove', onMouseUpdateInit, false);
		document.addEventListener('mousemove', onMouseUpdate, false);
	}

	// For the rest of the moving
	function onMouseUpdate(e) {
		//var position = setPosition(new Point(e.pageX,e.pageY));
		if (!inButtonArea(e.pageX,e.pageY)) {
			var position= new Point(e.pageX, e.pageY);
			var oldLat = mazorManager.point2LatLng(position);
<<<<<<< HEAD
			mazorManager.mouseDifLat = oldLat.lat - mazorManager.point2LatLng(mazorManager.previousPosition).lat;
			mazorManager.mouseDifLng = mazorManager.point2LatLng(position).lng - mazorManager.point2LatLng(mazorManager.previousPosition).lng;
=======
			mouseDifLat = oldLat.lat() - mazorManager.point2LatLng(previousPosition).lat();
			mouseDifLng = mazorManager.point2LatLng(position).lng() - mazorManager.point2LatLng(previousPosition).lng();
			
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
			if (!disable){
				mazorManager.updatePosition(position);
			}
			mazorManager.addMovement(position.calcDistance(mazorManager.previousPosition));
			mazorManager.previousPosition = position;
		} else {
			if (mazorManager.getState() != mazorManager.states.DEACTIVATED) {
				mazorManager.deActivateMazor(position);
			}
		}
	}

		// For the rest of the movingg
	function onMouseClick(e) {
		mazorManager.addClick();
<<<<<<< HEAD
		if (!inButtonArea(e.pageX,e.pageY)){
			if (mazorManager.isMazorDeActivated()) {
				mazorManager.checkToActivate(mazorManager.previousPosition);
			} else {
				mazorManager.deActivateMazor(mazorManager.previousPosition);
				// put mazor at the place of the mouse
				mazorManager.updatePosition(mazorManager.previousPosition);
			}
		} 
=======
	
/* 		if (!inButtonArea(e.pageX,e.pageY) && start){
			var position = new Point(e.pageX,e.pageY);
			mazorManager.checkToActivate(position);
			document.removeEventListener('click', onMouseClick, false);
		} */
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
	}
	
	function onMouseClickDisabled(e) {
		
		mazorManager.addClick();
	}
	
	function onWheel(e) {
		mazorManager.addWheel();
	}
	
	function inButtonArea(x,y){
		if (x <425 && y < 185) {
			return true;
		}
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
		var latLng = new mapboxgl.LngLat(5.39524,52.28958);
		
		mapboxgl.accessToken = 'pk.eyJ1IjoiaWFtY2oiLCJhIjoiY2phd3Z0ajFtMG9mYTMwcGk2MjE4OGc1YyJ9.WmhfzYT1kijQRhyNfPZSVA';
		this.map = new mapboxgl.Map({
		container: 'Canvas',
		zoom: zoomLevel,
		center: latLng,
		style: 'mapbox://styles/mapbox/streets-v10'
		});
		
		this.map.scrollZoom.disable();
		//this.map.dragPan.disable();
		 
		 this.map.on('mousemove', function (event) {
              mouseLatLng = event.lngLat;
			//  mouseLatLng = new google.maps.LatLng(52.28958, 5.39524);

          });
		  
		  
	}
	
	Canvas.prototype.normalMode = function(){
		this.map.setOptions({  zoomControl: true  });
		this.map.setOptions({  gestureHandling: 'auto'  });
	}
	
	Canvas.prototype.getGestureHandling = function(){
		if (disable) {
			return 'auto';
		} else {
			return 'none';
		}
	}
	
	Canvas.prototype.zoomIn = function(angle){
<<<<<<< HEAD
		if (!mazorManager.zoomAngle || mazorManager.zoomAngle <2.1 || angle > mazorManager.zoomAngle){
			mazorManager.zoomAngle = angle+1;
		}

		if (angle < mazorManager.zoomAngle -5){
			var zoomToAdd = (((mazorManager.zoomAngle-angle) *2)/30)/10;
			var zoomFactor = Math.pow(2,zoomToAdd);
			var devideFactor = 1/(1-(1/zoomFactor));
		
			var lat = (mazorManager.mazor.originLatLng.lat - this.getCenter().lat)/devideFactor;
			var lng = (mazorManager.mazor.originLatLng.lng - this.getCenter().lng)/devideFactor;
			var newZoom = this.map.getZoom()+zoomToAdd;
			var newCenter = new mapboxgl.LngLat( this.getCenter().lng + lng, this.getCenter().lat + lat);
			this.map.jumpTo({zoom: newZoom, center: newCenter});
			//mazorManager.zoomAngle = angle;
=======
		//if (!zoomAngle || zoomAngle <30.1 || angle > zoomAngle){
		//	zoomAngle = angle+1;
		//}

		//if (angle < zoomAngle -30){
			var lat = (mazorManager.getMazorLatLng().lat() - this.map.getCenter().lat())/2;
			var lng = (mazorManager.getMazorLatLng().lng() - this.map.getCenter().lng())/2;
			this.map.setZoom(this.map.getZoom()+1);
			this.panLatLng( this.map.getCenter().lat() + lat,this.map.getCenter().lng() + lng);
			
		//	zoomAngle = angle;
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
			
		//}
		
	}
	
	Canvas.prototype.zoomOut = function(angle){
	
<<<<<<< HEAD
		if (!mazorManager.zoomAngle|| mazorManager.zoomAngle >357.9 || angle < mazorManager.zoomAngle){
			mazorManager.zoomAngle = angle-1;
		}

		if (angle > mazorManager.zoomAngle + 5){
					
			var zoomToSub = (((angle-mazorManager.zoomAngle) *2)/30)/10;
			var zoomFactor = Math.pow(2,zoomToSub);
			var multiplyFactor = -1 + Math.pow(2,zoomToSub);
		
			var lat = (mazorManager.mazor.originLatLng.lat - this.getCenter().lat)*multiplyFactor;
			var lng = (mazorManager.mazor.originLatLng.lng - this.getCenter().lng)*multiplyFactor;
			//this.map.setZoom(this.map.getZoom()-zoomToAdd);
			//this.panLatLng( this.getCenter().lat - lat,this.getCenter().lng - lng);
			var newZoom = this.map.getZoom() -zoomToSub;
			var newCenter = new mapboxgl.LngLat( this.getCenter().lng - lng, this.getCenter().lat - lat);
			this.map.jumpTo({zoom: newZoom, center: newCenter});
			//mazorManager.zoomAngle =angle;
		}
=======
		//if (!zoomAngle|| zoomAngle >329.9 || angle < zoomAngle){
		//	zoomAngle = angle-1;
		//}

	//	if (angle > zoomAngle + 30){
			var lat = (mazorManager.getMazorLatLng().lat() - this.map.getCenter().lat());
			var lng = (mazorManager.getMazorLatLng().lng() - this.map.getCenter().lng());
			this.map.setZoom(this.map.getZoom()-1);
			this.panLatLng( this.map.getCenter().lat() - lat,this.map.getCenter().lng() - lng);
			//zoomAngle =angle;
		//}
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
		
	}
	
	Canvas.prototype.zoom = function(zoomLevel){
		this.map.setZoom(zoomLevel);
	}
	
	Canvas.prototype.pan = function(direction,speed){
		
		// rekening houden met zoomfactor.
		panStepX = Math.pow(2,-(this.getZoom())) * 360 * panStep;
		panStepY =  Math.pow(2,-(this.getZoom())) * 180 * panStep;
		// hoek omrekenen naar x en y met gonio
		
		direction = getRealAngle(direction);
	
		panStepX = Math.cos(rad(direction)) * panStepX;
		panStepY = Math.sin(rad(direction)) * panStepY;
		//console.log(panStepX,panStepY);
		// x en y vermenigvuldigen met speed
		panStepX = panStepX * speed;
		panStepY = panStepY * speed;
		//console.log(panStepX,panStepY);
		//console.log(speed);
		this.panLatLng( this.map.getCenter().lat + panStepY,this.map.getCenter().lng + panStepX);
	}
	
	
	
	Canvas.prototype.panLatLng = function(lat,lng){
		var newCenter = new mapboxgl.LngLat( lng, lat);
		this.map.jumpTo({center: newCenter});
	}
	
	Canvas.prototype.getCenter = function(){
		return this.map.getCenter();
	}
	
	Canvas.prototype.setCenter = function(newCenter){
		this.map.setCenter = newCenter;
	}

	Canvas.prototype.getZoom = function(){
		return this.map.getZoom();
	}
	
	
	Canvas.prototype.latLng2Point = function(latLng){
		return this.map.project(latLng);
	}

	Canvas.prototype.point2LatLng = function(point){
		  return this.map.unproject(point);
	}
	
	Canvas.prototype.panTo = function(location){
		this.map.panTo(location);
	}
	

//Controller class
function MazorManager(){
	this.closeTimer;
	this.zoomTimer;
	this.panTimer;
	this.panModeTimer;
	this.states = {DEACTIVATED:1, ACTIVATED:2, ACTIVATEDCLOSABLE:3, ZOOMACTIVATED:4,PANACTIVATED:5,FULLPANMODEACTIVATED:6};
	this.mouseLatLng;
	this.previousPosition;
	this.mouseDifLat;
	this.mouseDifLng;
	this.zoomAngle;
	this.start=true;
	this.canvas = new Canvas();
	this.mazor = new Mazor();
	this.mouse = new Mouse();
	this.mouse.init();
	this.lastPosition;
	this.taskManager = new TaskManager();
}

	MazorManager.prototype.init = function(position){
		this.mazor.init();
		this.mazor.updatePosition(position);
	}

	//temp
	function string_of_enum(enumName,value) 
{
  for (var k in enumName) if (enumName[k] == value) return k;
  return null;
}
	
	//StateManagement
	MazorManager.prototype.updatePosition = function(position){
		
		//console.log(string_of_enum(states,this.mazor.state));
		//console.log(getState(this.mazor.state));
		if(this.mazor.isDeActivated()){
			this.mouse.clickToActivate();
		} else if (this.mazor.isActivated()){
			
			//The mouse could be still on the x, on the zoom icon, on the panicon or outside the mazor.
			
			this.checkToClosable(position)

		} else if (this.mazor.isActivatedClosable()){
<<<<<<< HEAD
			clearTimeout(this.zoomTimer);	
			clearTimeout(this.panTimer);	
			clearTimeout(this.closeTimer);
=======
			clearTimeout(zoomTimer);	
			clearTimeout(panTimer);	
			clearTimeout(closeTimer);
			clearInterval(zoomModeTimer);
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
			this.checkActivatedClosable(position);
		} else if (this.mazor.isZoomActivated()){

			// newApproach
<<<<<<< HEAD
			clearTimeout(this.panTimer);	
			clearTimeout(this.closeTimer);
=======
			clearTimeout(panTimer);		
			clearTimeout(closeTimer);
			//clearInterval(zoomModeTimer);
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
				if (!this.checkToClose(position)){
					if (this.checkToHighlightPan(position)){
						this.checkPanActivated(position);
					} else {
						if (this.checkToActivateZoomMode(position)){ 
							
							this.setZoomInOut(position);
							var t = this;
							zoomModeTimer = window.setInterval(function(){t.setZoomInOut(position);},zoomModeInterval);
							
						} else {
							//this.checkToEndZoomMode(position);
						}
					}
				}
		} else if (this.mazor.isZoomModePlusActivated()){
			//Check if of icon
			clearTimeout(panTimer);		
			clearTimeout(closeTimer);
			//clearInterval(zoomModeTimer);
				if (!this.checkToClose(position)){
					if (this.checkToHighlightPan(position)){
						this.checkPanActivated(position);
					} else {
						this.checkToEndZoomPlusMode(position);
					}
				}
		} else if (this.mazor.isZoomModeMinActivated()){
			//Check if of icon
			clearTimeout(panTimer);		
			clearTimeout(closeTimer);
			//clearInterval(zoomModeTimer);
				if (!this.checkToClose(position)){
					if (this.checkToHighlightPan(position)){
						this.checkPanActivated(position);
					} else {
						this.checkToEndZoomMinMode(position);
					}
				}
			
		} else if (this.mazor.isPanActivated()){
			this.mazor.activateFullPanMode();
			
		} else if (this.mazor.isFullPanModeActivated()){
<<<<<<< HEAD
			clearTimeout(this.closeTimer);
			clearTimeout(this.zoomTimer);
			clearInterval(this.panModeTimer);
=======
			clearTimeout(closeTimer);
			clearTimeout(zoomTimer);
			clearInterval(zoomModeTimer);
			clearInterval(panModeTimer);
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
			if (!this.cursorInPanArea(position)){
				!this.checkToClose(position)
			} 	
			this.pan(position);
		}
		this.mazor.updatePosition(position);
		
		
	}

	MazorManager.prototype.checkToActivate = function(position){
	 	this.mazor.activateMazor(position);
	}

	// this state can only be reached if the mazor is just activated.
	MazorManager.prototype.checkToClosable = function(position){
		//The mouse has to have left the center.
		if(this.mazor.origin.calcDistance(position)> cursorBallRadius && this.mazor.isActivated()){
			this.mazor.activateMazorClosable();
			return true;
		} else {
			return false;
		}
	}
	
	MazorManager.prototype.checkActivatedClosable = function(position){
		// the mazor is closeable, so we first check to close
		if (!this.checkToClose(position)) {
			// if not close then chech to highlight zoom or pan.
			if (this.checkToHighlightZoom(position)){
				// if highlight we can launch the timer to activate the zoom.
				this.checkZoomActivated(position);
			} else if (this.checkToHighlightPan(position)){
				// if highlight we can launch the timer to activate the pan.
				this.checkPanActivated(position);	
			} 
			
		} else
		{
			//the mazor is closed , start timer again in mazor.deActivateMazor
			
		}
	}
	
<<<<<<< HEAD
	MazorManager.prototype.checkToHighlightZoom = function(position){
		if(this.mazor.getZoomIconPosition().calcDistance(position) < cursorBallRadius*3){
=======
/* 	MazorManager.prototype.checkToHighlightZoom = function(position){
		if(this.mazor.zoomIcon.getRealPosition().calcDistance(position) < cursorBallRadius*3){
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
			this.mazor.highlightZoom();
			return true;
		} else {
			this.mazor.showNormalZoom();	
			return false;
		}
	} */
	
	MazorManager.prototype.checkToHighlightZoom = function(position){
		//if(this.mazor.origin.calcDistance(position) < cursorBallRadius*3||this.mazor.ZoomIconPlus.getRealPosition().calcDistance(position) < cursorBallRadius*3){
		if (this.cursorInZoomRing(position)) {
			this.mazor.highlightZoom();
			return true;
		} else {
			this.mazor.zoomIconMin.showNormal();
			this.mazor.zoomIconPlus.showNormal();			
			return false;
		}
	}
	
	
	MazorManager.prototype.checkZoomActivated = function(position){
			var t = this;
			this.zoomTimer = window.setTimeout(function(){t.mazor.activateZoom(position);},iconTimeOutms);
	}
	
	MazorManager.prototype.checkToEndZoomPlusMode = function(position){

		if (position.calcDistance(this.mazor.zoomIconPlus.realPosition) > cursorBallRadius *2){
	//		console.log(position.calcDistance(this.mazor.zoomIconMin.origin));
			//console.log('StopPlus');
			clearInterval(zoomModeTimer);
			this.mazor.activateZoom(position);
			this.mazor.zoomIconPlus.notHighlightZoomIcon();
		} 
	}
	
	MazorManager.prototype.checkToEndZoomMinMode = function(position){

		if (position.calcDistance(this.mazor.zoomIconMin.realPosition) > cursorBallRadius *2){
//			console.log(position.calcDistance(this.mazor.zoomIconPlus.origin));
			//console.log('StopMin');
			clearInterval(zoomModeTimer);
			this.mazor.activateZoom(position);
			this.mazor.zoomIconMin.notHighlightZoomIcon();
		} 
	}
	
	
	MazorManager.prototype.cursorInZoomRing= function(position){
		var dist = this.mazor.origin.calcDistance(position);
		if( dist < (zoomIconOffset + cursorBallRadius*3) && dist > (zoomIconOffset - cursorBallRadius*3)){
			return true;
		} else {
			return false;
		}
	}
	
	MazorManager.prototype.checkToActivateZoomMode = function(position){
		if (position.calcDistance(this.mazor.zoomIconPlus.realPosition) < cursorBallRadius *2.5){
			this.mazor.activateZoomModePlus();
			return true;
		} else if (position.calcDistance(this.mazor.zoomIconMin.realPosition) < cursorBallRadius *2.5){
			this.mazor.activateZoomModeMin();
			return true;
		} else {
			return false;
		}
	}
	
	MazorManager.prototype.setZoomInOut = function(position){
		//check position
/* 		var angle = this.mazor.origin.calcAngle(position); ;
		
		if (angle> this.mazor.zoomDegrees){
<<<<<<< HEAD
			this.mazor.showPlus();
=======
			//set icon
			//this.mazor.zoomIconPlus.showPlus();
			zoomFactor = zoomFactor + zoomChange;
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
			this.canvas.zoomIn(getRealAngle(this.mazor.origin.calcAngle(position)));
			
		} else {
<<<<<<< HEAD
			this.mazor.showMin();
			this.canvas.zoomOut(getRealAngle(this.mazor.origin.calcAngle(position)));	
		}
		
		this.mazor.zoomDegrees = angle;
=======
			//this.mazor.zoomIcon.showMin();
			this.canvas.zoomOut(getRealAngle(this.mazor.origin.calcAngle(position)));
			//change zoomlevel
			zoomFactor = zoomFactor - zoomChange;
			//this.canvas.zoomCanvasOut(this.mazor.originLatLng);
			//this.taskManager.addZoom(this.canvas.getZoom()-1);
			
		} */
		if (position.calcDistance(this.mazor.zoomIconPlus.realPosition) < cursorBallRadius *2.5){
			//console.log(position.calcDistance(this.mazor.zoomIconPlus.realPosition));
			this.canvas.zoomIn();
			//console.log(this.canvas.getZoom());
		} else if (position.calcDistance(this.mazor.zoomIconMin.realPosition) < cursorBallRadius *2.5){
			//console.log(position.calcDistance(this.mazor.zoomIconMin.realPosition));
			this.canvas.zoomOut();
		} else {
			clearInterval(zoomModeTimer);
			//this.mazor.deActivateZoomMode();
		}
		
		
		
		
		//var zoomFactor = this.mazor.zoomDegrees/angle ;
		//zoomFactor = zoomFactor -1;
		//zoomFactor = zoomFactor /10;
		//zoomFactor = zoomFactor + 1;
		//zoomFactor = 1;
		
		//this.mazor.zoomDegrees = angle;
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
	}
	
	MazorManager.prototype.checkToHighlightPan = function(position){
		if(!this.checkDeActivatePan(position)){
			this.mazor.highlightPan();
			return true;
		} else {
			this.mazor.notHighlightPan();
			return false;
		}
	}
	
	MazorManager.prototype.checkPanActivated = function(position){
		this.mazor.activatePan(position);
	}
	
	MazorManager.prototype.checkDeActivatePan = function(position){
		
		if(this.mazor.origin.calcDistance(position) < panIconOffset - cursorBallRadius*0.5){
			return true;
		} else {
			return false;
		}
	}
	
	MazorManager.prototype.checkFullPanModeActivated = function(position){
		if(this.mazor.origin.calcDistance(position) > fullPanModeRadius ){
			this.lastPosition = mouseLatLng;
			this.mazor.activateFullPanMode(position);
		}
	}
	
	MazorManager.prototype.cursorInPanArea = function(position){
		var dist = this.mazor.origin.calcDistance(position);
		if( dist > (panIconOffset - cursorBallRadius*3)){
			return true;
		} else {
			return false;
		}
	}
	
	MazorManager.prototype.pan = function(position){
		var t = this;
		var direction = t.mazor.getDirection(position);
		var speed = t.mazor.getSpeed(position);
		
		// this is to move canvas to center
		this.panModeTimer = window.setInterval(function(){t.canvas.pan(direction,speed);},panInterval);
		if (this.directionCompare(oldDirection,direction,position)&& (speed < (oldSpeed -0.1 )||speed == 0 )) {
			clearInterval(this.panModeTimer);
			this.canvas.panLatLng(this.canvas.getCenter().lat - mazorManager.mouseDifLat,this.canvas.getCenter().lng - mazorManager.mouseDifLng);
		} else {
			
		}

		oldDirection = direction;
		oldSpeed = speed;
		this.taskManager.addSpeed(speed);
	}
	
	
	MazorManager.prototype.checkToClose = function(position){
		//Check if the cursor is near the center;
		if(this.mazor.origin.calcDistance(position)< cursorBallRadius){
			//wait to close
			var t = this;
			mazorManager.closeTimer = window.setTimeout(function(){t.mazor.deActivateMazor(position);},iconTimeOutms);
			return true;
		} else if(this.mazor.origin.calcDistance(position)> closeRadius){
			//return true;
		} else {
			return false;
		}
	}
	
	MazorManager.prototype.latLng2Point = function(latLng){
		return this.canvas.latLng2Point(latLng);
	}

	MazorManager.prototype.point2LatLng = function(point){
		return this.canvas.point2LatLng(point);
	}
	
	MazorManager.prototype.directionCompare = function(oldD, newD, position){
		if (this.mazor.origin.calcDistance(position) < closeRadius) {
			return true;
		} else {
			if (newD < oldD +0.5 && newD > oldD -0.5){
				return true;
			} else {
				return false;
			}
		}
	}
	
	MazorManager.prototype.addClick = function(){
		if (this.taskManager) {
			this.taskManager.addClick();
		}
	}
	
	MazorManager.prototype.getMazorLatLng = function(){
		return this.mazor.originLatLng;
	}
	
	MazorManager.prototype.addMovement = function(distance){
		if (this.taskManager) {
			this.taskManager.addMovement(distance);
		}
	}
	
	MazorManager.prototype.addWheel = function(){
		if (this.taskManager) {
			this.taskManager.addWheel();
		}
	}
	
	MazorManager.prototype.addZoom = function(zoomFactor){
		if (this.taskManager) {
			this.taskManager.addZoom(zoomFactor);
		}
	}
	
	MazorManager.prototype.success = function(){
		if (this.taskManager) {
			this.taskManager.success();
		}
	}
	
	MazorManager.prototype.ratherMouse = function(){
		if (this.taskManager) {
			this.taskManager.ratherMouse();
		}
	}
	
	MazorManager.prototype.ratherMazor = function(){
		if (this.taskManager) {
			this.taskManager.ratherMazor();
		}
	}
	
	MazorManager.prototype.failed = function(){
		if (this.taskManager) {
			this.taskManager.failed();
		}
	}
	
	MazorManager.prototype.change = function(){
		disable = true;
		this.start = false; 
		this.mazor.hideAll(this.mazor.origin);
		this.canvas.normalMode();
	//REMINDER	document.addEventListener('click', onMouseClick, false);
	}
	
	MazorManager.prototype.deActivateMazor = function(position){
		this.mazor.deActivateMazor(position);
<<<<<<< HEAD
		clearInterval(this.panModeTimer);
=======
		clearInterval(panModeTimer);
		clearInterval(zoomModeTimer);
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
		if (disable) {
			this.mazor.hideAll(this.mazor.origin);
		}
	}
	
<<<<<<< HEAD
	MazorManager.prototype.getState = function(){
		return this.mazor.state;
	}
	
	MazorManager.prototype.addState= function(newState){
		if (this.taskManager){
			this.taskManager.addState(newState);
		}
	}
	
	MazorManager.prototype.send= function(){
		if (this.taskManager){
			this.taskManager.send();
		}
	}

	MazorManager.prototype.panTo= function(location){
		this.canvas.panTo(location);
	}	

	MazorManager.prototype.isMazorDeActivated = function(){
		return (this.mazor.state == mazorManager.states.DEACTIVATED);
	}	
=======
	MazorManager.prototype.isMazorDeActived = function(){
		return this.mazor.isDeActivated();
	}
	
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
	
	MazorManager.prototype.zoom= function(zoomFactor){
		this.canvas.zoom(zoomFactor);
	}	
				
//Start of Mazor
function Mazor(){
	this.state;
	this.origin;
	this.originLatLng;
	this.cursorBall = new CursorBall();
	this.MazorDeActivated = new MazorDeActivated();
	this.innerCircle = new InnerCircle();
	this.outerCircle = new OuterCircle();
	this.close = new Close();
	this.panIcon = new PanIcon();
	this.zoomIconMin = new ZoomIconMin();
	this.zoomIconPlus = new ZoomIconPlus();
	this.panLine = new PanLine();
	this.zoomDegrees;
}

	//Only move the circels if not activated.
	Mazor.prototype.updatePosition = function(position){
		if (this.isDeActivated()){
			this.origin = position;
			this.MazorDeActivated.updatePositionAll(position);
		} else {
			this.cursorBall.updatePosition(position);
			this.innerCircle.rotate(this.origin.calcAngle(position)+180);
			this.outerCircle.rotate(this.origin.calcAngle(position)+180);
			this.panIcon.rotateIcon(this.origin.calcAngle(position));
			
			if(!this.isZoomActivated()&&!this.isZoomModePlusActivated()&&!this.isZoomModeMinActivated()){	
				this.zoomIconPlus.rotateIcon(this.origin.calcAngle(position)+zoomIconPlusAngle);
				this.zoomIconMin.rotateIcon(this.origin.calcAngle(position)-zoomIconMinAngle);
			}
			if (this.isFullPanModeActivated){
				this.panLine.drawLine(this.origin,position);
			}
		}
	}

	Mazor.prototype.init = function(){
<<<<<<< HEAD
		this.setState(mazorManager.states.DEACTIVATED);
=======
		this.setState(states.DEACTIVATED);
		this.zoomIconMin.hideAll();
		this.zoomIconPlus.hideAll();
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
		if (!disable){
			this.MazorDeActivated.showAll();
		}
	}
	
	Mazor.prototype.activateMazor = function(){
		this.originLatLng = mouseLatLng;
<<<<<<< HEAD
		this.setState(mazorManager.states.ACTIVATED);
		this.MazorDeActivated.hide();
=======
		this.setState(states.ACTIVATED);
		this.MazorDeActivated.hideAll();
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
		this.cursorBall.showNormal();
		this.cursorBall.setPosition(this.origin);
		this.innerCircle.show();
		this.innerCircle.setPosition(this.origin);
		this.outerCircle.show();
		this.outerCircle.setPosition(this.origin);
		this.showBlue();
		this.close.show();
		this.close.setPosition(this.origin);
		this.zoomIconMin.showNormal();
		this.zoomIconMin.offset = zoomIconOffset;
		this.zoomIconMin.setPosition(this.origin);
		this.zoomIconMin.rotateIcon(-90-zoomIconMinAngle);
		this.zoomIconPlus.showNormal();
		this.zoomIconPlus.offset = zoomIconOffset;
		this.zoomIconPlus.setPosition(this.origin);
		this.zoomIconPlus.rotateIcon(-90+zoomIconPlusAngle);
		this.panIcon.showNormal();
		this.panIcon.offset = panIconOffset;
		this.panIcon.setPosition(this.origin);
		this.panIcon.rotateIcon(-90);		
	}
	
	Mazor.prototype.activateMazorClosable = function(){
		this.setState(mazorManager.states.ACTIVATEDCLOSABLE);
	}
	
	Mazor.prototype.activateZoom = function(position){
<<<<<<< HEAD
		
		this.setState(mazorManager.states.ZOOMACTIVATED);
		this.zoomIcon.highlightZoom();		
		this.zoomIcon.showTwoWay();
=======
		zoomAngle = null;
		this.setState(states.ZOOMACTIVATED);
		this.zoomIconMin.highlightZoom();		
		this.zoomIconPlus.highlightZoom();
		//this.zoomIconMin.showTwoWay();
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
		this.zoomDegrees = this.origin.calcAngle(position);
		mazorManager.zoomAngle = getRealAngle(this.zoomDegrees);
		// extra stuff for if you come from panmode
		this.panIcon.showNormal();
		this.panIcon.rotateIcon(this.origin.calcAngle(position));
		this.cursorBall.showNormal();
		this.cursorBall.updatePosition(position);
		this.showPurple();
	
	}
	

	
	Mazor.prototype.deActivateZoom = function(position){
		this.zoomIconMin.showNormal();
		this.zoomIconMin.rotateIcon(this.origin.calcAngle(position)-zoomIconMinAngle);
		this.zoomIconPlus.showNormal();
		this.zoomIconPlus.rotateIcon(this.origin.calcAngle(position)+zoomIconPlusAngle);
		this.showBlue();
	}
	
	Mazor.prototype.deActivateZoomMode = function(position){
		
	}
	
	Mazor.prototype.activatePan = function(position){
		this.setState(mazorManager.states.PANACTIVATED);
		//neede because you van go from zoomActivated to Panactivated without passing ACTIVATEDCLOSABLE
		this.deActivateZoom(position);
		this.panIcon.hideAll();
		this.cursorBall.showFullPanMode();
		this.showGreen();
	}
	
	Mazor.prototype.deActivatePan = function(){
		this.panIcon.showNormal();
		this.showBlue();
		this.panLine.hideAll();
		
	}

	
	Mazor.prototype.activateFullPanMode = function(position){
<<<<<<< HEAD
		this.zoomIcon.hideAll();
		this.setState(mazorManager.states.FULLPANMODEACTIVATED);		
=======
		this.zoomIconMin.hideAll();
		this.zoomIconPlus.hideAll();
		this.setState(states.FULLPANMODEACTIVATED);		
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
		this.showGreen();
		this.panLine.showAll();
	}
	
	Mazor.prototype.deActivateFullPanMode = function(){
		this.panIcon.showNormal();
		this.cursorBall.showNormal();
		this.showBlue();
		this.panLine.hideAll();
	}
	
	Mazor.prototype.deActivateMazor = function(position){
<<<<<<< HEAD
		this.setState(mazorManager.states.DEACTIVATED);
		this.MazorDeActivated.show();
=======
		this.setState(states.DEACTIVATED);
		this.MazorDeActivated.showAll();
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
		this.cursorBall.hide();
		this.innerCircle.hide();
		this.outerCircle.hide();
		this.close.hide();
		this.panIcon.hideAll();
		this.panLine.hideAll();
		this.zoomIconMin.hideAll();
		this.zoomIconPlus.hideAll();
		this.updatePosition(this.origin);
	}
	
	Mazor.prototype.highlightZoom = function(){
			this.zoomIconMin.highlightZoom();
			this.zoomIconPlus.highlightZoom();
			this.notHighlightPan();
	}
	
	Mazor.prototype.notHighlightZoom = function(){
			this.zoomIconMin.notHighlightZoom();
			this.zoomIconPlus.notHighlightZoom();
	}

	Mazor.prototype.highlightPan = function(){
		this.panIcon.highlightPan();
	}
	
	Mazor.prototype.notHighlightPan = function(){
			this.panIcon.notHighlightPan();
	}
	
	Mazor.prototype.activateZoomModeMin = function(position){
		this.zoomIconMin.highlightZoomIcon();
		this.setState(states.ZOOMMODEMIN);
	}
	
	Mazor.prototype.activateZoomModePlus = function(position){
		this.zoomIconPlus.highlightZoomIcon();
		this.setState(states.ZOOMMODEPLUS);
	}
	
	Mazor.prototype.showPurple = function(position){
		document.documentElement.style.setProperty('--MazorColor', 'var(--purple-color)');
	}
	
	Mazor.prototype.showGreen = function(position){
		document.documentElement.style.setProperty('--MazorColor', 'var(--green-color)');
	}
	
	Mazor.prototype.showBlue = function(position){
		document.documentElement.style.setProperty('--MazorColor', 'var(--blue-color)');
	}
	
	Mazor.prototype.isActivated = function(){
		return (this.state == mazorManager.states.ACTIVATED);
	}
	
	Mazor.prototype.isActivatedClosable = function(){
		return (this.state == mazorManager.states.ACTIVATEDCLOSABLE);
	}

	Mazor.prototype.isDeActivated = function(){
		return (this.state == mazorManager.states.DEACTIVATED);
	}	
	
	Mazor.prototype.isZoomModeMinActivated = function(){
		return (this.state == states.ZOOMMODEMIN);
	}
	
	Mazor.prototype.isZoomModeActivated = function(){
		return (this.state == states.ZOOMMODE);
	}	

	Mazor.prototype.isZoomModePlusActivated = function(){
		return (this.state == states.ZOOMMODEPLUS);
	}		

	Mazor.prototype.isZoomActivated = function(){
		return (this.state == mazorManager.states.ZOOMACTIVATED);
	}	

	Mazor.prototype.isPanActivated = function(){
		return (this.state == mazorManager.states.PANACTIVATED);
	}	

	Mazor.prototype.isFullPanModeActivated = function(){
		return (this.state == mazorManager.states.FULLPANMODEACTIVATED);
	}	
	
	Mazor.prototype.getSpeed = function(position){
		//was 100;
		var speed = (130 - (maxPanDistance-this.origin.calcDistance(position)))/10;
		if (speed < 0){
			return 0;
		}else {
			return speed;
		}
		
	}	

	Mazor.prototype.getDirection = function(position){
		return this.origin.calcAngle(position);
	}	

	Mazor.prototype.setState = function(newState){
		this.state = newState;
		mazorManager.addState(this.state);
	}	

	Mazor.prototype.hideAll	 = function(){
		this.deActivateMazor();
<<<<<<< HEAD
		this.MazorDeActivated.hide();
	}
=======
		this.MazorDeActivated.hideAll();
		
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc

	Mazor.prototype.getZoomIconPosition	 = function(){
		return this.zoomIcon.getRealPosition();
	}	

	Mazor.prototype.showPlus	 = function(){
		this.zoomIcon.showPlus()
	}	
	
	Mazor.prototype.showMin = function(){
		this.zoomIcon.showMin();
	}	
	
	Mazor.prototype.showNormalZoom = function(){
		this.zoomIcon.showNormal();
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

	CursorBall.prototype.showFullPanMode = function(){
		document.documentElement.style.setProperty('--cursorBorder-color', 'var(--green-color)');
		document.documentElement.style.setProperty('--cursorFill-color', 'transparent');
	}
	
	CursorBall.prototype.showNormal = function(){
		this.show();
		document.documentElement.style.setProperty('--cursorBorder-color', 'var(--grey-color)');
		document.documentElement.style.setProperty('--cursorFill-color', 'var(--blue-color)');
	}

InnerCircle.prototype = new Element();
function InnerCircle(){
	this.setDiv('InnerCircle');	
}

MazorDeActivated.prototype = new Element();
function MazorDeActivated(){
	this.setDiv('MazorDeActivated');	
	//this.startText = new StartText();
	this.showText = false
}

	MazorDeActivated.prototype.showAll = function(){
		this.show();
		//if (!this.showText) {
		//	this.startText.show();
		//}
		//this.showText = true;
	}
	
	MazorDeActivated.prototype.hideAll = function(){
		this.hide();
		//this.startText.hide();
		document.getElementById('Task').style.setProperty('visibility', 'visible');
	}
	
	MazorDeActivated.prototype.updatePositionAll = function(position){
		this.updatePosition(position);
		//this.startText.updatePosition(position);
	}

StartText.prototype = new Element();
function StartText(){
	this.setDiv('ActivateText');	
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
	this.panIconImage = new PanIconImage();
}

	PanIcon.prototype.highlightPan = function(){
		document.documentElement.style.setProperty('--PanColor', 'var(--green-color)');
		document.getElementById('PanIconImage1515').setAttribute("src","PanIcon1515green.png");
	}

	PanIcon.prototype.notHighlightPan = function(){
		document.documentElement.style.setProperty('--PanColor', 'var(--blue-color)');
		document.getElementById('PanIconImage1515').setAttribute("src","PanIcon1515.png");
	}

	PanIcon.prototype.showActivePanIcon = function(){
		document.documentElement.style.setProperty('--PanColor', 'var(--green-color)');
		document.getElementById('PanIconImage1515').setAttribute("src","PanIcon1515green.png");
	}

	PanIcon.prototype.showNormal = function(){
		this.show();
		this.panIconImage.show();
		this.notHighlightPan();
	}
	
	PanIcon.prototype.hideAll = function(){
		this.hide();
		this.panIconImage.hide();
		
	}
	
PanIconImage.prototype = new Element();
function PanIconImage(){
	this.setDiv('PanIconImage');
}

ZoomIconMin.prototype = new Element();
function ZoomIconMin(){
	this.setDiv('MagnifyingGlassMin');
	//this.zoomHolder = new ZoomHolder();
	this.activatedZoomImageMin = new ActivatedZoomImageMin();
	this.activatedZoomImageMin.showNormal();
}

ZoomIconMin.prototype.showNormal = function(){
	this.show();
	//this.zoomHolder.show();
	//this.zoomHolder.showHolderOblique();
	this.activatedZoomImageMin.showNormal();
	this.notHighlightZoom();
}

ZoomIconMin.prototype.hideAll = function(){
	this.hide();
	//this.zoomHolder.hide();
	this.activatedZoomImageMin.hideAll();
	//this.notHighlightZoom();
}

/* ZoomIconMin.prototype.showTwoWay = function(){
	this.zoomHolder.showHolderStraight();
	this.activatedZoomImage.showTwoWay();
}

ZoomIconMin.prototype.showPlus = function(){
	this.activatedZoomImage.showPlus();
}

ZoomIconMin.prototype.showMin = function(){
	this.activatedZoomImage.showMin();
} */

ZoomIconMin.prototype.highlightZoom = function(){
	document.documentElement.style.setProperty('--ZoomColor', 'var(--purple-color)');
}

ZoomIconMin.prototype.notHighlightZoom = function(){
	document.documentElement.style.setProperty('--ZoomColor', 'var(--blue-color)');
}

ZoomIconMin.prototype.highlightZoomIcon = function(){
	document.documentElement.style.setProperty('--ZoomFillColor', 'var(--lightPurple-color)');
}

ZoomIconMin.prototype.notHighlightZoomIcon = function(){
	document.documentElement.style.setProperty('--ZoomFillColor', 'var(--white-color)');
}

ZoomIconPlus.prototype = new Element();
function ZoomIconPlus(){
	this.setDiv('MagnifyingGlassPlus');
	//this.zoomHolder = new ZoomHolder();
	this.activatedZoomImagePlus = new ActivatedZoomImagePlus();
	this.activatedZoomImagePlus.showNormal();
}

ZoomIconPlus.prototype.showNormal = function(){
	this.show();
	//this.zoomHolder.show();
	//this.zoomHolder.showHolderOblique();
	this.activatedZoomImagePlus.showNormal();
	this.notHighlightZoom();
}

ZoomIconPlus.prototype.hideAll = function(){
	this.hide();
	//this.zoomHolder.hide();
	this.activatedZoomImagePlus.hideAll();
	//this.notHighlightZoom();
}

/* ZoomIconPlus.prototype.showTwoWay = function(){
	this.zoomHolder.showHolderStraight();
	this.activatedZoomImage.showTwoWay();
}

ZoomIconPlus.prototype.showPlus = function(){
	this.activatedZoomImage.showPlus();
}

ZoomIconPlus.prototype.showMin = function(){
	this.activatedZoomImage.showMin();
} */

ZoomIconPlus.prototype.highlightZoom = function(){
	document.documentElement.style.setProperty('--ZoomColor', 'var(--purple-color)');
}

ZoomIconPlus.prototype.notHighlightZoom = function(){
	document.documentElement.style.setProperty('--ZoomColor', 'var(--blue-color)');
}

ZoomIconPlus.prototype.highlightZoomIcon = function(){
	document.documentElement.style.setProperty('--ZoomFillColor', 'var(--lightPurple-color)');
}

ZoomIconPlus.prototype.notHighlightZoomIcon = function(){
	document.documentElement.style.setProperty('--ZoomFillColor', 'var(--white-color)');
}


ActivatedZoomImageMin.prototype = new Element();
function ActivatedZoomImageMin(){
	this.setDiv('ActivatedZoomImageMin');
	this.activatedZoomImageMin1515 = new ActivatedZoomImageMin1515();
}

ActivatedZoomImageMin.prototype.hideAll = function(){
	this.hide();
	this.activatedZoomImageMin1515.hide();
}

ActivatedZoomImageMin.prototype.showNormal = function(){
	this.show();
	this.activatedZoomImageMin1515.show();
}

ActivatedZoomImagePlus.prototype = new Element();
function ActivatedZoomImagePlus(){
	this.setDiv('ActivatedZoomImagePlus');
	this.activatedZoomImagePlus1515 = new ActivatedZoomImagePlus1515();
}

ActivatedZoomImagePlus.prototype.hideAll = function(){
	this.hide();
	this.activatedZoomImagePlus1515.hide();
}

ActivatedZoomImagePlus.prototype.showNormal = function(){
	this.show();
	this.activatedZoomImagePlus1515.show();
}


ActivatedZoomImageMin1515.prototype = new Element();
function ActivatedZoomImageMin1515(){
	this.setDiv('ActivatedZoomMinImage1515');
}

ActivatedZoomImagePlus1515.prototype = new Element();
function ActivatedZoomImagePlus1515(){
	this.setDiv('ActivatedZoomPlusImage1515');
}


PanLine.prototype = new Element();
function PanLine(){
	this.setDiv('PanLine');
	this.panLineDiv = new PanLineDiv();
}

PanLine.prototype.showAll = function () {
	this.show();
	this.panLineDiv.show();
}

PanLine.prototype.hideAll = function () {
	this.hide();
	this.panLineDiv.hide();
}

PanLine.prototype.drawLine = function (origin, position) {
  var pointA = origin;
  var pointB = position;
  var angle = origin.calcAngle(position);
  var distance = origin.calcDistance(position);
  
  var a = Math.cos(rad(getRealAngle(angle)))*distance;
  var xdif = 0.5 * (distance - a);
  var ydif = (position.y - origin.y) /2;

  this.div.style.setProperty('transform', 'rotate(' + angle + 'deg)');
  this.div.style.setProperty('width', distance + 'px');
  this.panLineDiv.div.style.setProperty('width', distance - 10 + 'px');

  // Set Position
  this.div.style.setProperty('top', origin.y -10 + ydif +'px');
  this.div.style.setProperty('left', origin.x - xdif +'px');
}

PanLineDiv.prototype = new Element();
function PanLineDiv(){
	this.setDiv('PanLineDiv');
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
	
	//Calculate angle between the point and another points
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
	
function TaskButton(taskmanager){
	this.taskManager = taskmanager;
	
	this.div = document.getElementById('Task');
	this.textDiv = document.getElementById('TaskText');
}
	
	TaskButton.prototype.showStartText = function(text){
		//document.documentElement.style.setProperty('--TextButtonColor', 'var(--green-color)');
		this.textDiv.innerHTML = text;
	}
	
	TaskButton.prototype.showStopText = function(text){
		//document.documentElement.style.setProperty('--TextButtonColor', 'red');
		this.textDiv.innerHTML = text;
	}
	
	TaskButton.prototype.show = function(){
		$("#Task").fadeIn();
		this.div.style.setProperty('visibility','visible');
	}
	
	TaskButton.prototype.hide = function(){
		//$("#Task").fadeOut();
		this.div.style.setProperty('visibility','hidden');
	}
	
//Data Class
function TaskManager(){
	this.taskCount =0;
	this.userId = Date.now();
	this.tasks = new Set();
	this.activeTask = new Practice(this.userId,0);
	this.activeTask.isDone = true;
	this.taskButton = new TaskButton(this);
}

	TaskManager.prototype.newTask = function(){
		this.taskCount = this.taskCount + 1;
		var taskId = this.taskCount;
		switch(this.taskCount){
			case 1: 
				var task = new Task1(this.userId,taskId);
				break;
			case 2: 
				var task = new Task2(this.userId,taskId);
				break;
			case 3: 
				var task = new Task3(this.userId,taskId);
				break;
			case 4: 
				var task = new Task4(this.userId,taskId);
				mazorManager.change();
				break;	
			case 5: 
				var task = new Task5(this.userId,taskId);
				break;
			case 6: 
				var task = new Task6(this.userId,taskId);
				break;
			case 7: 
				var task = new CloseUp(this.userId,taskId);
				break;
		}
	    
		this.tasks.add(task);
		return task;
	}

	TaskManager.prototype.send = function(){
	   Email.send("corjanLeiden@gmail.com", "corjan@gmail.com",	this.userId, this.getTaskData() + "<br><br>" + this.getStatusLog(), "smtp.gmail.com", "CorjanLeiden@gmail.com", "Uffel1Uffel1");   
	}
	
	TaskManager.prototype.getTaskData = function(){
		//assamble data, create csv format.  
<<<<<<< HEAD
		var data = "UserId;TaskNumber;StartTime;TotalTime;Clicks;Movement;Wheel;Result" + "<br>"
	
=======
		var data = "UserId;TaskNumber;StartTime;TotalTime;Clicks;Movement;Wheel;Result;Opinion" + "<br>"

		
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
		for(let task of this.tasks){
			data = data + task.userId + ";" +task.number+ ";" +task.startTime+ ";" +task.totalTime+ ";" +task.clicks+ ";" +task.movement + ";" +task.wheel + ";" +task.result +";" +task.opinion +"<br>";
		}			
		return data;
	}
	
	TaskManager.prototype.getStatusLog = function(){
	   //assamble data, create csv format.  
	   	var statusLog = "UserId;TaskNumber;Time;Status" + "<br>"
		for(let task of this.tasks){
			statusLog = statusLog +task.statusLog+ "<br>";
		}			
		return statusLog;
	}
	
	TaskManager.prototype.taskButtonClicked = function(){
<<<<<<< HEAD
		this.activeTask.stop();
		this.activeTask = this.newTask();
		this.activeTask.start();
		this.taskButton.showStopText(this.activeTask.stopText);
		this.taskButton.hide();
		var t = this;
		window.setTimeout(function(){t.taskButton.show();},400);
=======
		
		//stop the task, show next buttons
		if (!this.activeTask.isDone){
			this.activeTask.stop();
			this.taskButton.showStopText(this.activeTask.stopText);
		} else {
			this.activeTask.isDone = true;
			this.activeTask = this.newTask();
			this.activeTask.start();
			this.taskButton.showStartText(this.activeTask.startText);
			this.taskButton.hide();
			var t = this;
			window.setTimeout(function(){t.taskButton.show();},400);
		}

>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
	}
	
	TaskManager.prototype.addState = function(state){
		this.activeTask.addState(state);
	}
	
	TaskManager.prototype.addClick = function(){
		this.activeTask.addClick();
	}
	
	TaskManager.prototype.addMovement = function(distance){
		this.activeTask.addMovement(distance);
	}
	
	TaskManager.prototype.addWheel = function(){
		this.activeTask.addWheel();
	}
	
	TaskManager.prototype.addSpeed = function(speed){
		this.activeTask.addSpeed(speed);
	}
	
	TaskManager.prototype.addZoom = function(zoomFactor){
		this.activeTask.addZoom(zoomFactor);
	}
	
	TaskManager.prototype.success = function(){
		this.activeTask.success();
		this.taskButtonClicked();
	}
	
	TaskManager.prototype.ratherMouse = function(){
		this.activeTask.ratherMouse();
		this.taskButtonClicked();
	}
	
	TaskManager.prototype.ratherMazor = function(){
		this.activeTask.ratherMazor();
		this.taskButtonClicked();
	}
	
	TaskManager.prototype.failed = function(){
		this.activeTask.failed();
		this.taskButtonClicked();
	}
	
	
	
function Task(taskUserId, taskId){
	this.userId = taskUserId;
	this.number = taskId;
	this.startTime=0;
	this.clicks=0;
	this.movement=0;
	this.totalTime=0;
	this.wheel=0;
	this.statusLog="";
	this.isDone=false;
	this.startText;
	this.stopText;
	this.started = false;
	this.result = "";
<<<<<<< HEAD
	this.buttons= "<div class='spacer'></div><div class='Button' onclick='mazorManager.success()'>Het is me gelukt</div><div class='spacer'></div><div class='Button' onclick='mazorManager.ratherMouse()'>Met een gewone muis was het sneller gegaan</div><div class='spacer'></div><div onclick='mazorManager.failed()' class='Button' >Het is me niet gelukt</div>"
	this.buttonsMazor= "<div class='spacer'></div><div class='Button' onclick='mazorManager.success()'>Het is me gelukt</div><div class='spacer'></div><div class='Button' onclick='mazorManager.ratherMouse()'>Met de Mazor was het sneller gegaan</div><div class='spacer'></div><div onclick='mazorManager.failed()' class='Button' >Het is me niet gelukt</div>"

=======
	this.opinion = "";
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc

}

	Task.prototype.start = function(){
		this.started = true;
	    this.startTime = Date.now();
		//todo
		mazorManager.panTo(this.location);
		mazorManager.zoom(this.zoomFactor);
	}
	
	Task.prototype.stop = function(){
		this.isDone = true;
		this.totalTime = Date.now() - this.startTime;
	}
	
	Task.prototype.addState = function(state){
	    this.statusLog = this.statusLog + this.userId + ";" + this.number+ ";" +  Date.now() + ";" + getState(state) + "<br>";
	}
	
	Task.prototype.addZoom = function(zoomLevel){
	    this.statusLog = this.statusLog + this.userId + ";" + this.number+ ";" +  Date.now() + ";z " + zoomLevel + "<br>";
	}
	
	Task.prototype.addSpeed = function(panSpeed){
	    this.statusLog = this.statusLog + this.userId + ";" + this.number+ ";" +  Date.now() + ";p " + panSpeed + "<br>";
	}
	
	Task.prototype.addClick = function(){
	    this.clicks = this.clicks + 1;
		this.statusLog = this.statusLog + this.userId + ";" + this.number+ ";" +  Date.now() + ";click<br>";
	}
	
	Task.prototype.addWheel = function(){
	    this.wheel = this.wheel + 1;
	}

	Task.prototype.addMovement = function(movement){
	    this.movement = this.movement + Math.abs(movement);
	}
	
	Task.prototype.done = function(){
	    return this.isDone;
	}
	
	Task.prototype.success = function(){
	    this.result= "success";
	}
	
	Task.prototype.ratherMouse = function(){
	    this.opinion= "ratherMouse";
	}
	
	Task.prototype.ratherMazor = function(){
	    this.opinion= "ratherMazor";
	}
		
	Task.prototype.failed = function(){
	    this.result= "failed";
	}
	
function getState(state){
	switch( state){
		case 1:
			return "DEACTIVATED";
		case 2:
			return "ACTIVATED";
		case 3:
			return "ACTIVATEDCLOSABLE";
		case 4:
			return "ZOOMACTIVATED";
		case 6:
			return "ZOOMMODEPLUS";
		case 7:
			return "ZOOMMODEMIN";
		case 8:
			return "PANACTIVATED";
		case 9:
			return "FULLPANMODEACTIVATED";
	}				
}
	
Practice.prototype = new Task();
function Practice(taskUserId, taskId){
	this.userId = taskUserId;
	this.number = taskId;
	this.startText = "Klik hier om te starten met oefenen";
	this.stopText = "<a class='Button' >Zoek bv vliegveld bij Jakarta, moskee op </a><BR><BR><a class='Button' >Bali Klik hier als je klaar bent met oefenen</a>";
}

Task1.prototype = new Task();
function Task1(taskUserId, taskId){
	this.userId = taskUserId;
	this.number = taskId;
<<<<<<< HEAD
	this.startText = "Klik hier om te starten met taak 1: <BR> zoek Amsterdam Centraal";
	this.stopText = "Taak 1: zoek Amsterdam Centraal<br>" + this.buttons;
	this.location = new mapboxgl.LngLat(5.39524,52.28958);
=======
	this.startText = "Taak 1: zoek Amsterdam Centraal<br>" + buttons;
	this.stopText = "Wat vond je er van?<BR>" + buttonEasyMouse;
	this.location = new google.maps.LatLng(52.28958, 5.39524);
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
	this.zoomFactor = 8;
	
}

Task2.prototype = new Task();
function Task2(taskUserId, taskId){
	this.userId = taskUserId;
	this.number = taskId;
<<<<<<< HEAD
	this.startText = "Klik hier om te starten met taak 2: <BR> zoek een ziekenhuis in Leeuwarden";
	this.stopText = "Taak 2: zoek een ziekenhuis in Leeuwarden<br>" + this.buttons;
	this.location = new mapboxgl.LngLat(5.792486,53.196635);
=======
	this.startText = "Taak 2: zoek een ziekenhuis in Leeuwarden<br>" + buttons;
	this.stopText = "Wat vond je er van?<BR>" + buttonEasyMouse;
	this.location = new google.maps.LatLng(53.196635, 5.792486);
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
	this.zoomFactor = 19;
	
}

Task3.prototype = new Task();
function Task3(taskUserId, taskId){
	this.userId = taskUserId;
	this.number = taskId;
<<<<<<< HEAD
	this.startText = "Klik hier om te starten met taak 3: <BR> zoek een plek om eten te kopen langs de A31";
	this.stopText = "Taak 3: zoek een plek om eten te kopen langs de A31<br>" + this.buttons;
	this.location = new mapboxgl.LngLat(7.305221,53.368559);
=======
	this.startText = "Taak 3: zoek een plek om eten te kopen langs de A31<br>" + buttons;
	this.stopText = "Wat vond je er van?<BR>" + buttonEasyMouse;
	this.location = new google.maps.LatLng(53.368559, 7.305221);
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
	this.zoomFactor = 16;
	
}

Task4.prototype = new Task();
function Task4(taskUserId, taskId){
	this.userId = taskUserId;
	this.number = taskId;
<<<<<<< HEAD
	this.startText = "Klik hier om te starten met taak 4: <BR> zoek Amsterdam Centraal";
	this.stopText = "Nu gewoon met MUIS en ZOOMEN rechtsonder <BR> Taak 4: zoek Rotterdam Centraal<br>" + this.buttonsMazor;
=======
	this.startText = "Nu gewoon met MUIS en ZOOMEN rechtsonder <BR> Taak 4: zoek Rotterdam Centraal<br>" + buttonsMazor;
	this.stopText = "Wat vond je er van?<BR>" + buttonEasyMazor;
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
	this.location = new google.maps.LatLng(52.28958, 5.39524);
	this.zoomFactor = 8;
	
}

Task5.prototype = new Task();
function Task5(taskUserId, taskId){
	this.userId = taskUserId;
	this.number = taskId;
<<<<<<< HEAD
	this.startText = "Klik hier om te starten met taak 5: <BR> zoek een ziekenhuis in Leeuwarden";
	this.stopText = "Taak 5: zoek een ziekenhuis in Maastricht<br>" + this.buttonsMazor;
	this.location = new mapboxgl.LngLat(5.695795,50.849093);
=======
	this.startText = "Taak 5: zoek een ziekenhuis in Maastricht<br>" + buttonsMazor;
	this.stopText = "Wat vond je er van?<BR>" + buttonEasyMazor;
	this.location = new google.maps.LatLng(50.849093, 5.695795);
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
	this.zoomFactor = 19;
	
}

Task6.prototype = new Task();
function Task6(taskUserId, taskId){
	this.userId = taskUserId;
	this.number = taskId;
<<<<<<< HEAD
	this.startText = "Klik hier om te starten met taak 3: <BR> zoek een plek om eten te kopen langs de A44";
	this.stopText = "Taak 6: zoek een plek om eten te kopen langs de A44<br>" + this.buttonsMazor;
	this.location = new mapboxgl.LngLat(8.676892,51.589606);
=======
	this.startText = "Taak 6: zoek een plek om eten te kopen langs de A44<br>" + buttonsMazor;
	this.stopText = "Wat vond je er van?<BR>" + buttonEasyMazor;
	this.location = new google.maps.LatLng(51.589606, 8.676892);
>>>>>>> 41d58c9ef2b6b069452bbcbc0d5001e9eb6a1cbc
	this.zoomFactor = 16;
	
}

	
CloseUp.prototype = new Task();
function CloseUp(taskUserId, taskId){
	this.userId = taskUserId;
	this.number = taskId;
	this.startText = "Bedankt voor je medewerking! <br> Ga terug naar het formulier";
	this.stopText = "Je bent bijna klaar! <br> Ga terug naar het formulier om je mening te geven";
	this.location = new mapboxgl.LngLat(7.305221,53.368559);
	mazorManager.send();
	
}	
	

//Radians
function rad(x) {
  return x * Math.PI / 180;
}

function getRealAngle(x) {

  if ( x<0){
	  return x*-1;
  } else{
	  return 180 + (180 - x);
  }
}