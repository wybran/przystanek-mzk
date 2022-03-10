import L from 'leaflet';
import "./Marker.css";

const BusMarker = new L.Icon({
    iconUrl: require('../images/map_bus.png'),
    iconRetinaUrl: require('../images/map_bus.png'),
    iconSize: new L.Point(24, 30),
    className: 'leaflet-div-icon'
});

export { BusMarker };