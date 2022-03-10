import L from 'leaflet';
import "./Marker.css";

const StopMarker = new L.Icon({
    iconUrl: require('../images/busstop_marker.png'),
    iconRetinaUrl: require('../images/busstop_marker.png'),
    iconSize: new L.Point(20, 20),
    className: 'leaflet-div-icon'
});

export { StopMarker };