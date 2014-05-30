var selectedShape, maxZoomService, map, toggleDrawingControl, transitLayer, drawingManager, weatherLayer, cloudLayer, impositionDrawingMapBounds, impositionDrawingMapOverlay;
var weatherLayerFlag, DrawingControlFlag = false;
var infoBoxFlag = true;
var allShapes = new Array();
var mapOptions = {
  center: new google.maps.LatLng(49.419517, 26.959320),
  zoom: 16,
  // disableDefaultUI: true,
  panControl: false,
  zoomControl: true,
  zoomControlOptions: {
    style: google.maps.ZoomControlStyle.SMALL
  },
  mapTypeControl: true,
  mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
      },
  scaleControl: false,
  streetViewControl: false,
  overviewMapControl: false,
  mapTypeId: google.maps.MapTypeId.HYBRID
};
var polyOptions = {
  strokeWeight: 0,
  draggable: true,
  fillOpacity: 0.7,
  fillColor: '#32CD32',
  editable: true,
  strokeColor: '#358235',
  strokeOpacity: 1,
  strokeWeight: 2,
};

window.onload = function(){
  document.getElementById('map-send-form').addEventListener('submit',function(evt){
    evt.preventDefault();
  },false);

  var request = new XMLHttpRequest();
  request.onreadystatechange = function(){
    var objs, drawingShape, decodeString, rectBounds, infoWindowContent;
    if (request.readyState != 4) return;
    if (request.status == 200){
      objs = JSON.parse(request.responseText);
      if (objs.length < 1) return;
      objs.map(function(el){
        decodeString = google.maps.geometry.encoding.decodePath(el.coordinates);
        infoWindowContent = '<h4>Shop name</h4>\
                                <a href="#">Link to shop</a>\
                                <small>'+ el.description +'</small>';
        switch(el.shape_type){
          case 'polygon':
            drawingShape = new google.maps.Polygon();
            drawingShape.setPath(decodeString);
          break;
          case 'rectangle':
            drawingShape = new google.maps.Rectangle();
            rectBounds = new google.maps.LatLngBounds(decodeString[0], decodeString[1]);
            drawingShape.setBounds(rectBounds);
          break;
        }
        drawingShape.setMap(map);
        attachShapeInfoWindow(drawingShape, infoWindowContent);
        google.maps.event.addListener(drawingShape, 'click', function(evt){
          this.infoWindow.setPosition(evt.latLng);
          this.infoWindow.open(map);
        });
        google.maps.event.addListener(drawingShape, 'mouseover', function(evt){
          this.setOptions({
            fillOpacity: 0.5
          });
        });
        google.maps.event.addListener(drawingShape, 'mouseout', function(evt){
          this.setOptions({
            fillOpacity: 0.3
          });
        });
      });
    }
  }
  request.open("GET", '/map/index.json', true);
  request.setRequestHeader("Content-Type", "text/javascript");
  request.send(null);


  toggleDrawingControl = document.getElementById('toggleDrawingControl');
  toggleDrawingControl.addEventListener('click', function(){
    if(!DrawingControlFlag){
      drawingManager.setOptions({
        drawingControl: true
      });
    }else{
      drawingManager.setOptions({
        drawingControl: false
      });
    }
    DrawingControlFlag = !DrawingControlFlag;
  }, false);

  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);

  drawingManager = new google.maps.drawing.DrawingManager({
    drawingControl: false,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.POLYGON,
        google.maps.drawing.OverlayType.RECTANGLE
      ]
    },
    rectangleOptions: polyOptions,
    polygonOptions: polyOptions
  });
  drawingManager.setMap(map);

  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e){
    var newShape;
    drawingManager.setDrawingMode(null);
    newShape = e.overlay;
    newShape.type = e.type;
    google.maps.event.addListener(newShape, 'click', function(){
      setSelection(newShape);
    });
    setSelection(newShape);
  });

  google.maps.event.addDomListener(document.getElementById('deleteShape'), 'click', deleteSelectedShape);

  google.maps.event.addListener(map, 'click', function(){
    clearSelection();
    closeAllInfoboxes();
  });
  
  google.maps.event.addDomListener(document.getElementById('saveShape'), 'click', function(evt){
    var encodeString, path, boundsObj, sw, ne, shapeToObj, shapeJson, req;
    var rectMassCoordinates = new Array();
    if(selectedShape && selectedShape.type != google.maps.drawing.OverlayType.MARKER){
      switch(selectedShape.type){
        case "polygon":
          path = selectedShape.getPath();
          encodeString = google.maps.geometry.encoding.encodePath(path);
          break;
        case "rectangle":
          boundsObj = selectedShape.getBounds();
          sw = boundsObj.getSouthWest();
          ne = boundsObj.getNorthEast();
          rectMassCoordinates.push(sw);
          rectMassCoordinates.push(ne);
          encodeString = google.maps.geometry.encoding.encodePath(rectMassCoordinates);
          break;
      }
      shapeToObj = new ShapeToObj();
      shapeToObj.shapeType = selectedShape.type;
      shapeToObj.shapeCoord = encodeString;
      shapeJson = JSON.stringify(shapeToObj);
      // console.info(shapeJson);
      req = new XMLHttpRequest();
      req.onreadystatechange = function(){
        if(req.readyState != 4) return;
        if(req.status == 200){
          if(req.responseText === 'Success')
            location.reload(true);
          else if(req.responseText === 'Error')
            console.info('Some error in action. Shape is not saved.')
        }
      }
      req.open("POST", "/map/create_shape", true);
      req.setRequestHeader("Content-Type", "application/json");
      req.send(shapeJson);
    }else{
      alert("Select shape please!");
    }
  });

  loadMapMarkers();

  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(createResetButton());
  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(createControlPanel());

  weatherLayer = new google.maps.weather.WeatherLayer({
    temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT
  });
  weatherLayer.setMap(map);
  cloudLayer = new google.maps.weather.CloudLayer();
  cloudLayer.setMap(map);
  
  impositionDrawingMapBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(49.417534, 26.956768),
    new google.maps.LatLng(49.419642,26.96006));

  impositionDrawingMapOverlay = new google.maps.GroundOverlay(
      'https://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
      impositionDrawingMapBounds);

  google.maps.event.addDomListener(document.getElementById('apply-overlay'), 'click', applyOverlay);
  google.maps.event.addDomListener(document.getElementById('hide-overlay'), 'click', hideOverlay);

};


//This obj will be send
function ShapeToObj(){
  this.shapeType = '';
  this.shapeCoord = '';
  this.shapeDescription = "Some shape description";
};
var pop_up_info = "border: 0px solid black; background-color: #ffffff; padding:15px; margin-top: 8px; border-radius:10px; -moz-border-radius: 10px; -webkit-border-radius: 10px; box-shadow: 1px 1px #888;";


function attachShapeInfoWindow(shape, html){
  shape.infoWindow = new google.maps.InfoWindow({
    content: html
  });
};

function loadMapMarkers (){
  var boxTextGlastonbury, infoboxOptionsGlastonbury;
  var markerPositionLeeds = new google.maps.LatLng(49.419517, 26.959320);
  var markerIconLeeds = {
    url: 'http://source.tutsplus.com/webdesign/tutorials/041_googlemaps/gooogle-maps-api-tutorial-files-for-ALL-parts-of-the-tutorial/icons/icon_leeds.png',
    size: new google.maps.Size(216, 151),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(192, 148)
  };
  var markerShapeLeeds = {
    coord: [18,8,208,28,200,113,162,110,190,145,128,109,6,93],
    type: 'poly'
  };

  markerGlastonbury = new google.maps.Marker({
    position: markerPositionLeeds,
    map: map,
    title: 'Some title text bla bla',
    icon: markerIconLeeds,
    shape: markerShapeLeeds,
    zIndex:107
  });

  boxTextGlastonbury = document.createElement("div");
  boxTextGlastonbury.style.cssText = pop_up_info;
  boxTextGlastonbury.innerHTML = '<span class="pop_up_box_text"><img src="http://source.tutsplus.com/webdesign/tutorials/041_googlemaps/gooogle-maps-api-tutorial-files-for-ALL-parts-of-the-tutorial/content/glastonbury.jpg" width="400" height="285" border="0" /></span>';

  infoboxOptionsGlastonbury = {
     content: boxTextGlastonbury
    ,disableAutoPan: false
    ,maxWidth: 0
    ,pixelOffset: new google.maps.Size(-241, 0)
    ,zIndex: null
    ,boxStyle: { 
      background: "none"
      ,opacity: 0.8
      ,width: "430px"
     }
    ,closeBoxMargin: "10px 2px 2px 2px"
    ,closeBoxURL: "https://www.thalys.com/img/destinations/close.png"
    ,infoBoxClearance: new google.maps.Size(1, 1)
    ,isHidden: false
    ,pane: "floatPane"
    ,enableEventPropagation: false
  };

  infoboxGlastonbury = new InfoBox(infoboxOptionsGlastonbury);

  google.maps.event.addListener(markerGlastonbury, "click", function (e) {
    infoboxGlastonbury.open(map, this);
    this.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
    setZoomWhenMarkerClicked();
    map.setCenter(markerGlastonbury.getPosition());
  });

  google.maps.event.addListener(map, 'center_changed', function(){   });

};

function setZoomWhenMarkerClicked(){
var currentZoom = map.getZoom();
  if (currentZoom < 16){
      map.setZoom(16);
  }
}
function createResetButton (){
 controlUI2 = document.createElement('div');
 controlUI2.style.backgroundColor = '#ffffff';
 controlUI2.style.borderRadius='5px';
 controlUI2.style.margin='10px';
 controlUI2.style.paddingTop='2px';
 controlUI2.style.paddingBottom='2px';
 controlUI2.style.paddingLeft='2px';
 controlUI2.style.paddingRight='5px';
 controlUI2.style.textAlign='center';
 controlUI2.style.width='148px';
 controlUI2.style.height='31px';
 controlUI2.innerHTML = '<div onClick="handelRequests(\'reset\')" OnMouseOver="this.style.cursor=\'pointer\';" OnMouseOut="this.style.cursor=\'default\';" ><img src="http://source.tutsplus.com/webdesign/tutorials/041_googlemaps/gooogle-maps-api-tutorial-files-for-ALL-parts-of-the-tutorial/icons/button_reset.png" width="148" height="31" border="0"/></div>';
 return controlUI2;
}
function createControlPanel (){
 smallEvents = document.createElement('div');
 smallEvents.style.minHeight='108px';
 smallEvents.style.width='129px';
 smallEvents.style.marginTop='0px';
 smallEvents.style.marginBottom='0px';
 smallEvents.style.marginLeft='0px';
 smallEvents.style.marginRight='0px';
 smallEvents.style.paddingTop='0px';
 smallEvents.style.paddingBottom='2px';
 smallEvents.style.paddingLeft='0px';
 smallEvents.style.paddingRight='0px';
 smallEvents.style.cssFloat='left';
 smallEvents.innerHTML = '<div align="center" onClick="handelRequests(\'small_events\')" OnMouseOver="smallEventsOver(this)" OnMouseOut="smallEventsOut(this)"><img src="http://source.tutsplus.com/webdesign/tutorials/041_googlemaps/gooogle-maps-api-tutorial-files-for-ALL-parts-of-the-tutorial/icons/button_small_event.png" width="128" height="107" border="0"/></div>';
 return smallEvents;
}
function handelRequests (buttonPressed) {
  if (buttonPressed === "reset"){
    map.setZoom(16);
    map.setCenter(mapOptions.center);
    closeAllInfoboxes();
  }else if (buttonPressed === 'small_events'){
    if(infoBoxFlag){ markerGlastonbury.setMap(null); }else{ markerGlastonbury.setMap(map); }
  infoBoxFlag = !infoBoxFlag;
  }
};
function closeAllInfoboxes(){
  infoboxGlastonbury.close();
}
function smallEventsOver(imgDiv){
  imgDiv.style.cursor = 'pointer';
  imgDiv.style.paddingTop = '10px';
}
function smallEventsOut(imgDiv){
  imgDiv.style.cursor = 'default';
  imgDiv.style.paddingTop = '0';
}

function applyOverlay(){
  impositionDrawingMapOverlay.setMap(map);
}
function hideOverlay() {
  impositionDrawingMapOverlay.setMap(null);
}
//Shape methods
function deleteSelectedShape(){
  if (selectedShape) {
    if(window.confirm("Are you shure?")){
      selectedShape.setMap(null);
    }else{
      return false;
    } 
  }
}
function clearSelection(){
  if (selectedShape){
    if (selectedShape.type != google.maps.drawing.OverlayType.MARKER)
        selectedShape.setEditable(false);
    selectedShape = null;
  }
}
function setSelection(shape){
  clearSelection();
  selectedShape = shape;
  if (selectedShape.type != google.maps.drawing.OverlayType.MARKER){
      shape.setEditable(true);
  }
}
