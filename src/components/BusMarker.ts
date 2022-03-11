import L from "leaflet";
import "./Marker.css";

const BusMarker = (label: any, isElectric: boolean) => {
  return L.divIcon({
    html: `<span class="busLabel">${label}</span> 
    ${isElectric ? `<span class="type">⚡</span>` : null}`,
    className: "busMarker",
    iconSize: L.point(24, 30, true),
  });
};

export { BusMarker };
