var selectedShape, allShapes;
allShapes = new Array();
function detectBrowser(){
  var useragent = navigator.userAgent;
  var mapdiv = document.getElementById("map");

  if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
    mapdiv.style.width = '100%';
    mapdiv.style.height = '100%';
  } else {
    mapdiv.style.width = '800px';
    mapdiv.style.height = '400px';
  }
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
function getCoordinates(){
  if(selectedShape){
    switch(selectedShape.type){
      case "circle":
        center = selectedShape.getCenter();
        radius = selectedShape.getRadius();
        message = "center: " + center +
                  "<br>radius: " + radius;
        break;
      case "polyline":
      case "polygon":
        arPath = selectedShape.getPath().getArray();
        message = "coordinates: " + arPath;
        break;
      case "marker":
        position = selectedShape.getPosition();
        message = "position: " + position;
        break;
      case "rectangle":
        bounds = selectedShape.getBounds();
        message = "bounds: " + bounds;
        break;
    }
    document.getElementById("debug").innerHTML +=  "<br><b>type: " + selectedShape.type + "</b><br>";
    document.getElementById("debug").innerHTML += message + "<br>";
  }else{
    alert("Please select a shape.")
  }
}
function addEvent(el, e, handler){
  if(el.addEventListener){
    el.addEventListener(e, handler, false);
  }else if (el.attachEvent){
    el.attachEvent('on' + e, handler);
  }else{
    el['on' + e] = handler;
  }
}
function clearSelection(){
  if (selectedShape){
    if (selectedShape.type != google.maps.drawing.OverlayType.MARKER){
        selectedShape.setEditable(false);
    }
    selectedShape = null;
  }// end selectedShape if
}
function setSelection(shape){
  clearSelection();
  selectedShape = shape;
  if (selectedShape.type != google.maps.drawing.OverlayType.MARKER){
      shape.setEditable(true);
  }
}

window.onload = function(){
  detectBrowser();
  var infoWindow = new google.maps.InfoWindow();

  var toggleDrawingControl = document.getElementById('toggleDrawingControl');
  var DrawingControlFlag = false;

  
  var mapOptions = {
    center: new google.maps.LatLng(49.4204, 26.9534),
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
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);


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

  var drawingManager = new google.maps.drawing.DrawingManager({
      // drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: false,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.POLYLINE,
          google.maps.drawing.OverlayType.RECTANGLE
        ]
      },
      polylineOptions: {
        strokeColor: "#FF8C00"
      },
      rectangleOptions: polyOptions,
      circleOptions: polyOptions,
      polygonOptions: polyOptions
    });
    drawingManager.setMap(map);

    addEvent(toggleDrawingControl, 'click', function(evt){
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
    })

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
      drawingManager.setDrawingMode(null);
      //Наложение мое дорогое!!!
      var newShape = e.overlay;
      //Круг тут чи прямокутник в стрінгу!
      newShape.type = e.type;
      // alert(e.type);
      // alert(newShape);
      google.maps.event.addListener(newShape, 'click', function(){
        setSelection(newShape);
      });
      google.maps.event.addListener(newShape, 'rightclick', function(event){
        var cont = "<h4>Shop name</h4>\
          <a href='#''>link to shop</a></br>\
          <img width='300' height='100' src='https://d3ui957tjb5bqd.cloudfront.net/images/screenshots/products/2/23/23014/red-shopping-bags-o.jpg?1371585704'/></br>\
          <small>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil, placeat, nemo quas fuga quisquam laboriosam illo voluptatibus dolor officiis in architecto ad eveniet? Consequuntur, dignissimos corporis reprehenderit laborum cum ex.</small>";
        infoWindow.setContent(cont);
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
      });
      setSelection(newShape);
    });

    google.maps.event.addDomListener(document.getElementById('deleteShape'), 'click', deleteSelectedShape);

    google.maps.event.addDomListener(document.getElementById('coordinatesShape'), 'click', getCoordinates);

    google.maps.event.addListener(map, 'click', function(){
      clearSelection();
      infoWindow.close();
    });

    google.maps.event.addDomListener(document.getElementById('saveShape'), 'click', function(evt){
      if(selectedShape && selectedShape.type != google.maps.drawing.OverlayType.MARKER){
        // shapeID
        alert(selectedShape);
      }
    });

    google.maps.event.addListener(map, 'center_changed', function(){
     // if(map.getZoom() < 14){
       
     // }
    });


  // for(var i in navigator){
  //   console.log(i+" : "+navigator[i]+"\n");
  // }

};
