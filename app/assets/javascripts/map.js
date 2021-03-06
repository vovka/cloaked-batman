var selectedShape, maxZoomService, map, toggleDrawingControl, transitLayer, drawingManager, weatherLayer, cloudLayer, impositionDrawingMapBounds, impositionDrawingMapOverlay;
var weatherLayerFlag, DrawingControlFlag = false;
var infoBoxFlag = true;
var frm = document.forms.fileupload;
var allMarkersCoordinat = new Array();
var allMarkers = new Array();
var tempShapes = [];
window.allShapesObjects = new Array();
window.infoWindows = new Array();
var mapZoom = 3;
var mapCenter = new google.maps.LatLng(42.29356419, -0.61523437);
var mapZoomMax = 16;
var mapZoomMin = 2;

var mapOptions = {
  center: mapCenter,
  zoom: mapZoom,
  maxZoom: mapZoomMax,
  minZoom: mapZoomMin,
  panControl: false, 
  zoomControl: true,
  zoomControlOptions: {
    style: google.maps.ZoomControlStyle.SMALL
  },
  mapTypeControl: true,
  mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        mapTypeIds: [ 'map_styles_festival', 'map_styles_festival_zoomed']
      },
  scaleControl: false,
  streetViewControl: false,
  overviewMapControl: false,
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
var style_festival = [
  {
    "featureType": "administrative",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "poi",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "transit",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "road",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "landscape",
    "stylers": [
      { "color": "#FFE200" }
    ]
  },{
    "featureType": "water",
    "stylers": [
      { "visibility": "on" },
      { "color": "#4f92c6" }
    ]
  }
];

var style_festival_zoomed = [
  {
    "featureType": "administrative",
    "stylers": [
      { "visibility": "on" }
    ]
  },{
    "featureType": "poi",
    "stylers": [
      { "visibility": "on" }
    ]
  },{
    "featureType": "transit",
    "stylers": [
      { "visibility": "on" }
    ]
  },{
    "featureType": "road",
    "stylers": [
      { "visibility": "on" }
    ]
  },{
    "featureType": "landscape",
    "stylers": [
      { "color": "#FFE200" }
    ]
  },{
    "featureType": "water",
    "stylers": [
      { "visibility": "on" },
      { "color": "#4f92c6" }
    ]
  },   {
    "featureType": "poi.park",
  "elementType": "geometry",
    "stylers": [
      { "color": "#FFFF00" }
    ]
  }
];
var styled_festival = new google.maps.StyledMapType(style_festival, {name: "Festival style"});
var styled_festival_zoomed = new google.maps.StyledMapType(style_festival_zoomed, {name: "Festival style zoomed"});

$(document).on('ready page:load', function () {
  
   document.getElementById('map_image').addEventListener('change', function(evt){
    var pattern = /\.(jpe?g|png|ico)$/gi;
    if(evt.target.value.search(pattern) != -1)
      document.getElementById('send-btn').disabled = false;
    else{
      document.getElementById('send-btn').disabled = true;
      alert("Icorrect file format");
    }
   },false);

   document.getElementById('modal-open').addEventListener('click',function(evt){
    var modalOpenBtn = evt.target;
    if(selectedShape && selectedShape.type != google.maps.drawing.OverlayType.MARKER){
      modalOpenBtn.setAttribute('data-toggle', 'modal');
    }else{
      alert("Select a shape please.");
      modalOpenBtn.setAttribute('data-toggle', '');
      evt.preventDefault();
    }
   },false);
   
  document.getElementById('fileupload').addEventListener('submit', function(evt){
    var encodeString, path, boundsObj, sw, ne, shapeToObj, shapeJson, req, inputElement;
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

      $('#fileupload').fileupload({
        autoUpload: false,
        dataType: 'post',
        imageMaxWidth: 200,
        imageMaxHeight: 150,
        maxFileSize: 40000,
        imageCrop: true, // Force cropped images
        uploadTemplate: function (o) { },
        completed: function(e, data) { },
        downloadTemplate: function (o) { }});
    }
    inputElement = document.createElement("input");
    inputElement.type = "hidden";
    inputElement.name = "shape";
    inputElement.value = shapeToObj.shapeType + "||" + shapeToObj.shapeCoord;
    document.forms.fileupload.appendChild(inputElement);

  },false);
  

  var request = new XMLHttpRequest();
  request.onreadystatechange = function(){
    var objs, drawingShape, decodeString, rectBounds, infoWindowContent;
    if (request.readyState != 4) return;
    if (request.status == 200){
      objs = JSON.parse(request.responseText);
      if (objs.length < 1) return;
      for(var i = 0; i < objs.length; i++)
        allShapesObjects.push(objs[i]);
      addMarkers();
      for(var i = 0; i < objs.length; i++){
        var marker = new google.maps.Marker({
          position: allMarkersCoordinat[i],
          icon: '/uploads/shape/image/map-153939_150.png'
        });
        marker.setMap(map);
        infoWindowContent = '<h4>Shop name</h4>\
              <a href="#">Link to shop</a><br>\
              <img src="'+objs[i].image.map_image.url+'" alt="some text" /><br>\
              <small>'+ objs[i].description +'</small>';
        attachShapeInfoWindow(marker, infoWindowContent);
        allMarkers.push(marker);
      }
      allMarkers.map(function(el){
        google.maps.event.addListener(el, 'click', function(evt){
          this.infoWindow.open(map, el);
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

  map.mapTypes.set('map_styles_festival', styled_festival);
  map.mapTypes.set('map_styles_festival_zoomed', styled_festival_zoomed);

  map.setMapTypeId('map_styles_festival');
//--------------------------------------------------------------------ZOOM Chnage
  google.maps.event.addListener(map, "zoom_changed", function() {
    var newZoom = map.getZoom();
    console.log(newZoom);
    if(newZoom == 16){
      map.setMapTypeId(google.maps.MapTypeId.HYBRID);
      return;
    }
    if (newZoom > 4){
       map.setMapTypeId('map_styles_festival_zoomed');
    } else {
      map.setMapTypeId('map_styles_festival');
    }
  });



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
    closeAllInfowindows();
    clearSelection();
    closeAllInfoboxes();
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
    new google.maps.LatLng(49.41846967, 26.95007643),
    new google.maps.LatLng(49.42297817, 26.95981822));

  impositionDrawingMapOverlay = new google.maps.GroundOverlay(
      '/uploads/shape/image/kovrovoy_rynok_v_hmeljnickom.jpg',
      impositionDrawingMapBounds);

  google.maps.event.addDomListener(document.getElementById('apply-overlay'), 'click', applyOverlay);
  google.maps.event.addDomListener(document.getElementById('hide-overlay'), 'click', hideOverlay);

});


function ShapeToObj(){
  this.shapeType = '';
  this.shapeCoord = '';
  this.shapeDescription = '';
};
var pop_up_info = "border: 0px solid black; background-color: #ffffff; padding:15px; margin-top: 8px; border-radius:10px; -moz-border-radius: 10px; -webkit-border-radius: 10px; box-shadow: 1px 1px #888;";


function addMarkers(){
  var coordinate, rectBounds;
  if (typeof allShapesObjects !== 'undefined' && allShapesObjects.length > 0){
    allShapesObjects.map(function(el){
      decodeString = google.maps.geometry.encoding.decodePath(el.coordinates);
      switch(el.shape_type){
        case 'polygon':
          coordinate = decodeString[0];
        break;
        case 'rectangle':
          rectBounds = new google.maps.LatLngBounds(decodeString[0], decodeString[1]);
          coordinate = rectBounds.getCenter();
        break;
      }
      allMarkersCoordinat.push(coordinate);
    });
  }else return;
}
function attachShapeInfoWindow(shape, html){
  shape.infoWindow = new google.maps.InfoWindow({
    content: html,
    maxWidth: 250
  });
  infoWindows.push(shape.infoWindow);
};

function loadMapMarkers (){
  var boxTextGlastonbury, infoboxOptionsGlastonbury;
  var markerPositionLeeds = new google.maps.LatLng(49.42170802, 26.95361495);
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
  boxTextGlastonbury.innerHTML = '<span class="pop_up_box_text"><img src="http://source.tutsplus.com/webdesign/tutorials/041_googlemaps/gooogle-maps-api-tutorial-files-for-ALL-parts-of-the-tutorial/content/glastonbury.jpg" width="300" height="150" border="0" /></span>';

  infoboxOptionsGlastonbury = {
     content: boxTextGlastonbury
    ,disableAutoPan: false
    ,maxWidth: 0
    ,pixelOffset: new google.maps.Size(-241, 0)
    ,zIndex: null
    ,boxStyle: { 
      background: "none"
      ,opacity: 0.8
      ,width: "330px"
     }
    ,infoBoxClearance: new google.maps.Size(1, 1)
    ,isHidden: false
    ,pane: "floatPane"
    ,enableEventPropagation: false
  };

  infoboxGlastonbury = new InfoBox(infoboxOptionsGlastonbury);
  //------------------------------------------------------------------------------------

  google.maps.event.addListener(markerGlastonbury, "click", function (e) {
    setZoomWhenMarkerClicked();
    map.setCenter(markerGlastonbury.getPosition());
  });
  google.maps.event.addListener(markerGlastonbury, 'mouseover', function(e){
    infoboxGlastonbury.open(map, this);
    this.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
  });
  google.maps.event.addListener(markerGlastonbury, 'mouseout', function(e){
    closeAllInfoboxes();
  });

  //READING
  var markerPositionReading = new google.maps.LatLng(26.43122806, -1.49414062);

  var markerIconReading = {
    url: 'http://source.tutsplus.com/webdesign/tutorials/041_googlemaps/gooogle-maps-api-tutorial-files-for-ALL-parts-of-the-tutorial/icons/icon_reading.png',
    size: new google.maps.Size(196, 114),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(46, 109)
  };

  var markerShapeReading = {
    coord: [8,54,177,7,189,49,65,88,44,110,47,91,20,98],
    type: 'poly'
  };

  markerReading = new google.maps.Marker({
    position: markerPositionReading,
      map: map,
      title: 'Reading Festival',
    icon: markerIconReading,
    shape: markerShapeReading,
    zIndex:106
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
    map.setZoom(3);
    map.setCenter(mapCenter);
    closeAllInfoboxes();
    map.setMapTypeId('map_styles_festival');
    closeAllInfowindows();
  }else if (buttonPressed === 'small_events'){
    if(infoBoxFlag){ 
      markerGlastonbury.setMap(null); 
      markerReading.setMap(null);
    }else{ 
      markerGlastonbury.setMap(map);
      markerReading.setMap(map);
    }
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
function closeAllInfowindows(){
  for (var i=0;i<infoWindows.length;i++)
    infoWindows[i].close();
}
function applyOverlay(){
  var decodeString, drawingShape;
  impositionDrawingMapOverlay.setMap(map);

  for(var i = 0; i < allMarkers.length; i++)
    allMarkers[i].setMap(null);

  allShapesObjects.map(function(el){
    decodeString = google.maps.geometry.encoding.decodePath(el.coordinates);
    infoWindowContent = '<h4>Shop name</h4>\
              <a href="#">Link to shop</a><br>\
              <img src="'+el.image.map_image.url+'" alt="some text" /><br>\
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
    tempShapes.push(drawingShape);
  });
}
function hideOverlay() {
  impositionDrawingMapOverlay.setMap(null);
  if(tempShapes.length > 0){
    for(var i = 0; i < tempShapes.length; i++)
      tempShapes[i].setMap(null);
  }
  for(var i = 0; i < allMarkers.length; i++)
    allMarkers[i].setMap(map);
}

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
