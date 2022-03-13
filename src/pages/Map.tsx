import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonText,
  useIonViewDidEnter,
} from "@ionic/react";
import { useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import { useQuery } from "react-query";
import { BusMarker } from "../components/BusMarker";
import { StopMarker } from "../components/StopMarker";
import ApiService from "../services/ApiService";
import { toast } from "react-toastify";
import { Geolocation } from "@capacitor/geolocation";
import "./Map.css";
import Timestamp from "../utils/Timestamp";
import { arrowBackCircle } from "ionicons/icons";
import { useHistory } from "react-router";

const Map: React.FC = () => {
  const history = useHistory<any>();
  const [location, setLocation] = useState<any>({ lat: 0, lng: 0 });
  const markerRef = useRef<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const buses = useQuery("buses", () => ApiService.getBuses(), {
    refetchInterval: 10000,
  });
  const stops = useQuery("stops", ApiService.getStops);
  useQuery("info", ApiService.getInfo, {
    onSuccess: (data) => toast(data[0].text),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const [selectedStop, setSelectedStop] = useState<any | null>(null);
  const departures = useQuery(
    ["departures", selectedStop],
    ({ queryKey }) => ApiService.getDepartures(queryKey[1]),
    {
      refetchInterval: 10000,
    }
  );

  useIonViewDidEnter(() => {
    window.dispatchEvent(new Event("resize"));
    Geolocation.getCurrentPosition().then((res) => {
      const lat = res.coords.latitude;
      const lng = res.coords.longitude;
      setLocation({ lat, lng });
    });
    if (history.location.state?.stop) {
      setSelectedStop(history.location.state.stop.id);
      setModalOpen(true);
      history.replace("map", { stop: null });
    }
  });

  const clusterIcon = () => {
    return L.divIcon({
      className: "stopMarker",
      iconSize: L.point(20, 20, true),
    });
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <MapContainer
          whenCreated={(map) => {
            Geolocation.getCurrentPosition().then((res) => {
              const lat = res.coords.latitude;
              const lng = res.coords.longitude;
              setLocation({ lat, lng });
              markerRef.current.setLatLng([lat, lng]);
              map.flyTo({ lat: lat, lng: lng });
            });
          }}
          className="map-container"
          center={{ lat: 51.9356214, lng: 15.5061862 }}
          zoom={13}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=d973041fe75f479393efd1a71c26b6d3"
          />

          <Marker position={location} ref={markerRef}>
            <Tooltip>Twoja lokalizacja</Tooltip>
          </Marker>

          {buses.data &&
            Object.keys(buses.data).map((key, index) => (
              <Marker
                zIndexOffset={5}
                key={index}
                icon={BusMarker(
                  buses.data[key].label,
                  buses.data[key].type === "Autobusy Elektryczne"
                )}
                position={{
                  lat: buses.data[key].lat,
                  lng: buses.data[key].lon,
                }}>
                  <Popup>Numer boczny: {buses.data[key].id}</Popup>
                </Marker>
            ))}
          <MarkerClusterGroup
            maxClusterRadius={40}
            iconCreateFunction={clusterIcon}
          >
            {stops.data &&
              Object.keys(stops.data).map((key, index) => (
                <Marker
                  key={index}
                  icon={StopMarker}
                  position={{
                    lat: stops.data[key].lat,
                    lng: stops.data[key].lon,
                  }}
                  eventHandlers={{
                    click: async () => {
                      setSelectedStop(stops.data[key].id);
                      setModalOpen(true);
                    },
                  }}
                ></Marker>
              ))}
          </MarkerClusterGroup>
        </MapContainer>
      </IonContent>
      <IonModal
        isOpen={modalOpen}
        swipeToClose={true}
        onDidDismiss={() => setModalOpen(false)}
      >
        <IonContent>
          {departures.data && Object.keys(departures.data).length > 0 ? (
            <IonText color="success" class="ion-text-center">
              <h3>
                [{selectedStop}] {departures.data[0]?.stop}{" "}
                {Timestamp.timestampToTime(departures.dataUpdatedAt)}
              </h3>
            </IonText>
          ) : (
            <IonText color="success" class="ion-text-center">
              <h3>Brak odjazdów z tego przystanku</h3>
            </IonText>
          )}

          <IonList>
            {departures.data &&
              Object.keys(departures.data).map((key, index) => (
                <IonItem key={index}>
                  <IonLabel>
                    {departures.data[key].line} 🚌{" "}
                    {departures.data[key].destination}
                  </IonLabel>
                  {departures.data[key].time}
                </IonItem>
              ))}
          </IonList>

          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => setModalOpen(false)}>
              <IonIcon icon={arrowBackCircle} />
            </IonFabButton>
          </IonFab>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Map;
