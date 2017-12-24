// Date: 2017
// Auteur:Corjan van Uffelen
var mazorManager;

//settings
var timeOutms = 400;
var iconTimeOutms = 20;
var cursorBallRadius = 4.5; 
var closeRadius = 70;
var panIconOffset = 57;
var zoomIconOffset = 36;
var fullPanModeRadius = 70;
var zoomLevel = 5;
var maxPanDistance = 170;
var panInterval = 10;
var zoomModeInterval = 300;
var panStep = 0.0005;
var oldDirection = 400;
var oldSpeed = -1;
var zoomIconMinAngle = 40;
var zoomIconPlusAngle = zoomIconMinAngle+3;

// Start Mazor
function init(){
  mazorManager = new MazorManager();
}

var previousPosition;

//Model class
function Mouse(){

}

	// To show mazor on first move
	Mouse.prototype.init = function(){
		document.addEventListener('mousemove', onMouseUpdateInit, false);
		document.addEventListener('click', onMouseClick, false);	
	}
	
	
	Mouse.prototype.clickToActivate = function(){
		document.addEventListener('click', onMouseClick, false);

	}
	
	// To show mazor on first move
	function onMouseUpdateInit(e) {
		mazorManager.init(e.pageX,e.pageY);
		previousPosition= new Point(e.pageX, e.pageY);
		document.removeEventListener('mousemove', onMouseUpdateInit, false);
		document.addEventListener('mousemove', onMouseUpdate, false);
	}

	// For the rest of the moving
	function onMouseUpdate(e) {
		var position= new Point(e.pageX, e.pageY);
		var oldLat = mazorManager.point2LatLng(position);
		mazorManager.mouseDifLat = oldLat.lat - mazorManager.point2LatLng(previousPosition).lat;
		mazorManager.mouseDifLng = mazorManager.point2LatLng(position).lng - mazorManager.point2LatLng(previousPosition).lng;
		mazorManager.updatePosition(position);
		previousPosition = position;
	}

		// For the rest of the movingg
	function onMouseClick(e) {
			
		if (mazorManager.isMazorDeActived()) {
			mazorManager.checkToActivate(previousPosition);
		} else {
			mazorManager.deActivateMazor(previousPosition);
			// put mazor at the place of the mouse
			mazorManager.updatePosition(previousPosition);
		}
			
	}
	
	function setIdle(event){
		 mazorManager.setIdle(true);
	 }
	 
	 function setMouseLatLng(lngLat) {
		mazorManager.setMouseLatLng(lngLat);
	 }
	
	
//View Class
function Canvas(){
	this.map;
	this.setHeight();
	this.loadMaps();
	this.idle =true;
	this.mouseLatLng;

}

	//set Height of Canvas
	Canvas.prototype.setHeight = function(){
		var h = window.innerHeight - 19 ;
		document.getElementById('Wrapper').setAttribute("style","height:" + h + "px");
	}

	//set Height of Canvas
	Canvas.prototype.loadMaps = function(){
		var latLng = new mapboxgl.LngLat(5.39524,52.28958);
		
		mapboxgl.accessToken = 'pk.eyJ1IjoiaWFtY2oiLCJhIjoiY2piN3c3eWsxMHk1NjJycjZwcXZrdWh0dSJ9.2MdiDMGbpozKvzeOkMVz3A';
		this.map = new mapboxgl.Map({
		container: 'Canvas',
		zoom: zoomLevel,
		center: latLng,
		style: 'mapbox://styles/mapbox/streets-v10'
		});
		 
		 this.map.on('mousemove', function (event) {
              setMouseLatLng(event.lngLat);
          });
		  
 		  this.map.on('moveend', function (event) {
             setIdle(true);
          });
		  
		 this.map.dragPan.disable();
		 this.map.scrollZoom.disable();
	}
	
	Canvas.prototype.addMarker = function(latLng, mazor){
		var marker = new mapboxgl.Marker(mazor).setLngLat(latLng).addTo(this.map); 
		return marker;
	}
	

	Canvas.prototype.zoomIn = function(angle){
		var newZoom = this.getZoom()+0.4;
		this.map.easeTo({zoom: newZoom});
	}
	
	Canvas.prototype.zoomOut = function(angle){
	
		var newZoom = this.getZoom()-0.4;
		this.map.easeTo({zoom: newZoom});
	}
	
	Canvas.prototype.zoom = function(zoomLevel){
		this.map.setZoom(zoomLevel);
	}
	
	//Pan
	Canvas.prototype.pan = function(direction,speed){
		
		panStepX = Math.pow(2,-(this.getZoom())) * 360 * panStep;
		panStepY =  Math.pow(2,-(this.getZoom())) * 180 * panStep;

		direction = getRealAngle(direction);
	
		panStepX = Math.cos(rad(direction)) * panStepX;
		panStepY = Math.sin(rad(direction)) * panStepY;
		
		// x en y vermenigvuldigen met speed
		panStepX = panStepX * speed;
		panStepY = panStepY * speed;

		this.panLatLng( this.getCenter().lat + panStepY,this.getCenter().lng + panStepX);
	}
	
	Canvas.prototype.panLatLng = function(lat,lng){
		var newCenter = new mapboxgl.LngLat( lng, lat);
		var bool = false;
		this.map.jumpTo({center: newCenter});
		var bool = true;
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
	
	Canvas.prototype.setIdle = function(bool){
		 this.idle = bool;
	 }
	
	Canvas.prototype.removeControl = function(){
		   var cols = document.getElementsByClassName('mapboxgl-ctrl-top-right');
			for(i=0; i<cols.length; i++) {
				cols[i].style.visibility = 'hidden';
			}
	 }
	

//Controller class
function MazorManager(){
	this.canvas = new Canvas();
	this.mazor = new Mazor();
	this.mouse = new Mouse();
	this.mouse.init();
	this.lastPosition;
	this.closeTimer;
	this.zoomTimer;
	this.zoomModeTimer;
	this.panTimer;
	this.panModeTimer;
	this.states = {DEACTIVATED:1, ACTIVATED:2, ACTIVATEDCLOSABLE:3, ZOOMACTIVATED:4, ZOOMMODEPLUS:6, ZOOMMODEMIN:7, PANACTIVATED:8,FULLPANMODEACTIVATED:9};
	this.mouseDifLat;
	this.mouseDifLng;
}

	MazorManager.prototype.init = function(position){
		this.mazor.init();
		this.mazor.updatePosition(position);
	}

	//StateManagement
	MazorManager.prototype.updatePosition = function(position){
		
		if(this.mazor.isDeActivated()){
			this.mouse.clickToActivate();
		} else if (this.mazor.isActivated()){
			
			this.checkToClosable(position)

		} else if (this.mazor.isActivatedClosable()){
			clearTimeout(this.zoomTimer);	
			clearTimeout(this.panTimer);	
			clearTimeout(this.closeTimer);
			clearInterval(this.zoomModeTimer);
			this.checkActivatedClosable(position);
		} else if (this.mazor.isZoomActivated()){
			clearTimeout(this.panTimer);		
			clearTimeout(this.closeTimer);
			
			if (!this.checkToClose(position)){
				if (this.checkToHighlightPan(position)){
					this.checkPanActivated(position);
				} else {
					if (this.checkToActivateZoomMode(position)){ 
						this.prepareZoom(position);

						var t = this;
						this.zoomModeTimer = window.setInterval(function(){t.setZoomInOut(position);},zoomModeInterval);
					}
				}
			}
		} else if (this.mazor.isZoomModePlusActivated()){
			
			clearTimeout(this.panTimer);		
			clearTimeout(this.closeTimer);

			this.checkToEndZoomPlusMode(position);

		} else if (this.mazor.isZoomModeMinActivated()){
			//Check if of icon
			clearTimeout(this.panTimer);		
			clearTimeout(this.closeTimer);

			this.checkToEndZoomMinMode(position);
			
		} else if (this.mazor.isPanActivated()){
			this.mazor.activateFullPanMode();
			
		} else if (this.mazor.isFullPanModeActivated()){
			clearTimeout(this.closeTimer);
			clearTimeout(this.zoomTimer);
			clearInterval(this.zoomModeTimer);
			clearInterval(this.panModeTimer);
			if (!this.cursorInPanArea(position)){
				this.checkToClose(position);
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
			
		}
	}
	
	MazorManager.prototype.checkToHighlightZoom = function(position){
		if (this.cursorInZoomRing(position)) {
			this.mazor.highlightZoom();
			return true;
		} else {
			this.mazor.notHighlightZoom();		
			return false;
		}
	}
	
	
	MazorManager.prototype.checkZoomActivated = function(position){
		var t = this;
		this.zoomTimer = window.setTimeout(function(){t.mazor.activateZoom(position);},iconTimeOutms);
	}
	
	MazorManager.prototype.checkToEndZoomPlusMode = function(position){

		if (position.calcDistance(this.mazor.getPlusPosition()) > cursorBallRadius *2.5){
			clearInterval(this.zoomModeTimer);
			this.deActivateMazor();
		} 
	}
	
	MazorManager.prototype.checkToEndZoomMinMode = function(position){
		if (position.calcDistance(this.mazor.getMinPosition()) > cursorBallRadius *2.5){
			clearInterval(this.zoomModeTimer);
			this.deActivateMazor();
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
		if (position.calcDistance(this.mazor.getPlusPosition()) < cursorBallRadius *2.5){
			this.mazor.activateZoomModePlus();
			return true;
		} else if (position.calcDistance(this.mazor.getMinPosition()) < cursorBallRadius *2.5){
			this.mazor.activateZoomModeMin();
			return true;
		} else {
			return false;
		}
	}
	
	MazorManager.prototype.setZoomInOut = function(position){

		if (this.canvas.idle){
			if (position.calcDistance(this.mazor.getPlusPosition()) < cursorBallRadius *2.5){
				this.canvas.zoomIn();
			} else if (position.calcDistance(this.mazor.getMinPosition()) < cursorBallRadius *2.5){
				this.canvas.zoomOut();
			} else {
				clearInterval(this.zoomModeTimer);
			}
		}

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
			this.lastPosition = this.getMouseLatLng();
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
			this.canvas.panLatLng(this.canvas.getCenter().lat - this.mouseDifLat,this.canvas.getCenter().lng - this.mouseDifLng);
		} else {
			
		}
		
		oldDirection = direction;
		oldSpeed = speed;
	}
	
	MazorManager.prototype.checkToClose = function(position){
		//Check if the cursor is near the center;
		if(this.mazor.origin.calcDistance(position)< cursorBallRadius){
			var t = this;
			this.closeTimer = window.setTimeout(function(){t.mazor.deActivateMazor(position);},iconTimeOutms);
			return true;
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
	
	MazorManager.prototype.getMazorLatLng = function(){
		return this.mazor.originLatLng;
	}
	
	
	
	MazorManager.prototype.deActivateMazor = function(position){
		this.mazor.deActivateMazor(position);
		clearInterval(this.panModeTimer);
		clearInterval(this.zoomModeTimer);
		this.mazor.hideAll(this.mazor.origin);
	}
	
	MazorManager.prototype.isMazorDeActived = function(){
		return this.mazor.isDeActivated();
	}
	
	MazorManager.prototype.addMarker = function(latLng, mazor){
		var marker = this.canvas.addMarker(latLng, mazor);
		return marker;
	}
	
	MazorManager.prototype.prepareZoom = function(position){
		this.canvas.setIdle(false);
		this.mazor.hideForZoom();
		this.mazor.moveToCenter();
		
		if (position.calcDistance(this.mazor.zoomIconMin.realPosition) > cursorBallRadius *5) {
			this.canvas.map.flyTo({center:this.mazor.originLatLng, speed:0.2, zoom:this.canvas.getZoom()+0.4});
			this.mazor.hideForMinZoom();
		} else if (position.calcDistance(this.mazor.zoomIconPlus.realPosition) > cursorBallRadius *5) {
			this.canvas.map.flyTo({center:this.mazor.originLatLng, speed:0.2, zoom:this.canvas.getZoom()-0.4});
			this.mazor.hideForPlusZoom();
		}
	}
	
	MazorManager.prototype.setIdle = function(bool){
		 this.canvas.setIdle(bool);
	 }
	 
	 MazorManager.prototype.getMouseLatLng = function(bool){
		 return this.canvas.mouseLatLng;
	 }
	 
	 MazorManager.prototype.setMouseLatLng = function(lngLat){
		 this.canvas.mouseLatLng = lngLat ;
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
	this.marker = new Marker();
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
		this.setState(mazorManager.states.DEACTIVATED);
		this.zoomIconMin.hideAll();
		this.zoomIconPlus.hideAll();
		this.MazorDeActivated.showAll();
	}
	
	Mazor.prototype.activateMazor = function(){
		this.originLatLng = mazorManager.getMouseLatLng();
		this.setState(mazorManager.states.ACTIVATED);
		this.MazorDeActivated.hideAll();
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
		this.setState(mazorManager.states.ZOOMACTIVATED);
		this.zoomIconMin.highlightZoom();		
		this.zoomIconPlus.highlightZoom();
		this.zoomDegrees = this.origin.calcAngle(position);
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
		this.zoomIconMin.hideAll();
		this.zoomIconPlus.hideAll();
		this.setState(mazorManager.states.FULLPANMODEACTIVATED);		
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
		this.setState(mazorManager.states.DEACTIVATED);
		this.MazorDeActivated.showAll();
		this.cursorBall.hide();
		this.innerCircle.hide();
		this.outerCircle.hide();
		this.close.hide();
		this.panIcon.hideAll();
		this.panLine.hideAll();
		this.zoomIconMin.hideAll();
		this.zoomIconPlus.hideAll();
		this.updatePosition(this.origin);
		this.marker.hide();
	}
	
	Mazor.prototype.highlightZoom = function(){
			this.zoomIconMin.highlightZoom();
			this.zoomIconPlus.highlightZoom();
			this.notHighlightPan();
	}
	
	
	Mazor.prototype.notHighlightZoom = function(){
			this.zoomIconMin.notHighlightZoom();
			this.zoomIconPlus.notHighlightZoom();
			this.zoomIconMin.notHighlightZoomIcon();
			this.zoomIconPlus.notHighlightZoomIcon();
	}

	Mazor.prototype.highlightPan = function(){
		this.panIcon.highlightPan();
	}
	
	Mazor.prototype.notHighlightPan = function(){
			this.panIcon.notHighlightPan();
	}
	
	Mazor.prototype.activateZoomModeMin = function(position){
		this.zoomIconMin.highlightZoomIcon();
		this.setState(mazorManager.states.ZOOMMODEMIN);
	}
	
	Mazor.prototype.activateZoomModePlus = function(position){
		this.zoomIconPlus.highlightZoomIcon();
		this.setState(mazorManager.states.ZOOMMODEPLUS);
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
		return (this.state == mazorManager.states.ZOOMMODEMIN);
	}
	
	Mazor.prototype.isZoomModeActivated = function(){
		return (this.state == mazorManager.states.ZOOMMODE);
	}	

	Mazor.prototype.isZoomModePlusActivated = function(){
		return (this.state == mazorManager.states.ZOOMMODEPLUS);
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
	}	

	Mazor.prototype.hideAll	 = function(){
		this.deActivateMazor();
		this.MazorDeActivated.hideAll();
	}		

	Mazor.prototype.moveToCenter = function(){		
		this.marker.show();
		mazorManager.addMarker(this.originLatLng,this.marker.div);		
	}	
	
	Mazor.prototype.hideForZoom	 = function(){
		this.innerCircle.hide();
		this.outerCircle.hide();
		this.close.hide();
		this.panIcon.hideAll();
		this.panLine.hideAll();
	}
	
	Mazor.prototype.getPlusPosition	 = function(){
		return this.zoomIconPlus.realPosition;
	}
	
	Mazor.prototype.getMinPosition	 = function(){
		return this.zoomIconMin.realPosition;
	}
	
	Mazor.prototype.hideForMinZoom	 = function(){
		this.zoomIconMin.hideAll();
	}
	
	Mazor.prototype.hideForPlusZoom	 = function(){
		this.zoomIconPlus.hideAll();
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

Marker.prototype = new Element();
function Marker(){
	this.setDiv('Marker');	
}

MazorDeActivated.prototype = new Element();
function MazorDeActivated(){
	this.setDiv('MazorDeActivated');	
	//this.startText = new StartText();
	this.showText = false
}

	MazorDeActivated.prototype.showAll = function(){
		this.show();
	}
	
	MazorDeActivated.prototype.hideAll = function(){
		this.hide();
	}
	
	MazorDeActivated.prototype.updatePositionAll = function(position){
		this.updatePosition(position);
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
	this.activatedZoomImageMin = new ActivatedZoomImageMin();
	this.activatedZoomImageMin.showNormal();
}

	ZoomIconMin.prototype.showNormal = function(){
		this.show();
		this.notHighlightZoomIcon();
		this.activatedZoomImageMin.showNormal();
		this.notHighlightZoom();
	}

	ZoomIconMin.prototype.hideAll = function(){
		this.hide();
		this.activatedZoomImageMin.hideAll();
	}

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
	this.activatedZoomImagePlus = new ActivatedZoomImagePlus();
	this.activatedZoomImagePlus.showNormal();
}

	ZoomIconPlus.prototype.showNormal = function(){
		this.show();
		this.notHighlightZoomIcon();
		this.activatedZoomImagePlus.showNormal();
		this.notHighlightZoom();
	}

	ZoomIconPlus.prototype.hideAll = function(){
		this.hide();
		this.activatedZoomImagePlus.hideAll();
	}

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
