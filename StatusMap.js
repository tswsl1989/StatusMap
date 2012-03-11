var map;
var markerLayer;
var fsqMarkerLayer;
var fbMarkerLayer;
var posVectorLayer;
var icon = new OpenLayers.Icon("./tw.png", new OpenLayers.Size(20,20));
var icon2 = new OpenLayers.Icon("./fsq.png", new OpenLayers.Size(20,20));
var icon3 = new OpenLayers.Icon("./pin2.png", new OpenLayers.Size(20,20));
var popups = new Array();
var fpopups = new Array();
var fbpopups = new Array();

function initMap() {
	map = new OpenLayers.Map('map');
	map.Projection=new OpenLayers.Projection("EPSG:900913");
	map.addLayer(new OpenLayers.Layer.OSM());
	map.addLayer(new OpenLayers.Layer.Google("Google Streets"));
	//map.setCenter(new OpenLayers.LonLat(51.484,-3.168), 15);
	posVectorLayer = new OpenLayers.Layer.Vector("Current Location");
	map.addLayer(posVectorLayer);
	fbMarkerLayer = new OpenLayers.Layer.Markers("Facebook Check-ins");
	map.addLayer(fbMarkerLayer);
	fsqMarkerLayer = new OpenLayers.Layer.Markers("Foursquare Venues");
	map.addLayer(fsqMarkerLayer);
	markerLayer = new OpenLayers.Layer.Markers("Tweets");
	map.addLayer(markerLayer);
	map.addControl(new OpenLayers.Control.LayerSwitcher());
}
function addMarker(id, lat, lon, text){
	position = new OpenLayers.LonLat(lon, lat).transform( new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
	marker = new OpenLayers.Marker(position.clone(), icon.clone());
	popups["pop"+id] = new OpenLayers.Popup("pop"+id, position, new OpenLayers.Size(250,100), text, icon.clone());
	popups["pop"+id].panMapIfOutOfView = true;
	marker.events.register("mousedown", marker, function(e){
		//popup = new OpenLayers.Popup("pop"+id, this.lonlat, new OpenLayers.Size(100,100), text, this.icon);
		//popup.panMapIfOutOfView = true;
		map.addPopup(popups["pop"+id], true);
		
	});
	markerLayer.addMarker(marker);
}
function getCenterRadius(extent){
	c = extent.getCenterLonLat();
	r = new OpenLayers.LonLat(extent.right,c.lat);
	c = c.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
	r = r.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
	dist = OpenLayers.Util.distVincenty(c,r);
	return [c, dist*0.62137];
}
function clearMap() {
	for (i in map.popups) {
		map.removePopup(i);
	}
	delete popups;
	popups = new Array();
	markerLayer.clearMarkers();
}

function updateFsqLayer(){
	a = getCenterRadius(map.getExtent());
	$.getJSON('https://sucs.org/~tswsl1989/StatusMap/4sqvs.php?ll='+a[0].lat+','+a[0].lon+'&radius='+a[1]*410, function(e){
		if (e.meta.code != 200) {
			return false;
		}
		$.each(e.response.venues,function(index, venue){
			console.log(venue);
			text = venue.name;
			if (venue.location.address) {
				text += "<br />"+venue.location.address;
			}
			text += "<br / ><a href='http://foursquare.com/v/"+venue.id+"'><img src='fsqbadge.png' alt='View on Foursquare' /></a>";
			addFsqMarker(venue.id, venue.location.lat, venue.location.lng, text);
		});
	});
}
function addFsqMarker(id, lat, lon, text){
	position = new OpenLayers.LonLat(lon, lat).transform( new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
	marker = new OpenLayers.Marker(position.clone(), icon2.clone());
	fpopups["fp"+id] = new OpenLayers.Popup("fp"+id, position, new OpenLayers.Size(230,100), text, icon2.clone());
	fpopups["fp"+id].panMapIfOutOfView = true;
	marker.events.register("mousedown", marker, function(e){
		//popup = new OpenLayers.Popup("pop"+id, this.lonlat, new OpenLayers.Size(100,100), text, this.icon);
		//popup.panMapIfOutOfView = true;
		map.addPopup(fpopups["fp"+id], true);
		
	});
	fsqMarkerLayer.addMarker(marker);
}
function addFBMarker(id, lat, lon, text){
	position = new OpenLayers.LonLat(lon, lat).transform( new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
	marker = new OpenLayers.Marker(position.clone(), icon3.clone());
	fbpopups["fb"+id] = new OpenLayers.Popup("fb"+id, position, new OpenLayers.Size(230,100), text, icon3.clone());
	fbpopups["fb"+id].panMapIfOutOfView = true;
	marker.events.register("mousedown", marker, function(e){
		//popup = new OpenLayers.Popup("pop"+id, this.lonlat, new OpenLayers.Size(100,100), text, this.icon);
		//popup.panMapIfOutOfView = true;
		map.addPopup(fbpopups["fb"+id], true);
		
	});
	fbMarkerLayer.addMarker(marker);
}
