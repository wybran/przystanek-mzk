import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
} from "@ionic/react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import { useQuery } from "react-query";
import { BusMarker } from "../components/BusMarker";
import { StopMarker } from "../components/StopMarker";
import ApiService from "../services/ApiService";
import "./Map.css";

const Map: React.FC = () => {
  const buses = useQuery("buses", () => ApiService.getBuses(), {refetchInterval: 5000});
  const stops = useQuery("stops", ApiService.getStops);
  const info = useQuery("info", ApiService.getInfo);

  useIonViewDidEnter(() => {
    window.dispatchEvent(new Event("resize"));
  });

  const clusterIcon = () => {
    return L.divIcon({
      className: "stopMarker",
      iconSize: L.point(20, 20, true)
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle size="small">
            {info.data ? info.data[0].text : "Ładowanie"}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <MapContainer
          className="map-container"
          center={{ lat: 51.9356214, lng: 15.5061862 }}
          zoom={13}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=d973041fe75f479393efd1a71c26b6d3"
          />
          {buses.data &&
            Object.keys(buses.data).map((key, index) => (
              <Marker
                key={index}
                icon={BusMarker}
                position={{
                  lat: buses.data[key].lat,
                  lng: buses.data[key].lon,
                }}
              >
                <Tooltip direction="right" offset={[8, 0]} opacity={1} permanent>{buses.data[key].label}</Tooltip>
              </Marker>
            ))}
          <MarkerClusterGroup maxClusterRadius={40} iconCreateFunction={clusterIcon}>
            {stops.data &&
              Object.keys(stops.data).map((key, index) => (
                <Marker
                  key={index}
                  icon={StopMarker}
                  position={{
                    lat: stops.data[key].lat,
                    lng: stops.data[key].lon,
                  }}
                >
                  <Popup>{stops.data[key].name}</Popup>
                </Marker>
              ))}
          </MarkerClusterGroup>
        </MapContainer>
      </IonContent>
    </IonPage>
  );
};

export default Map;
