import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  useIonViewDidEnter,
} from "@ionic/react";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import { useQuery } from "react-query";
import { BusMarker } from "../components/BusMarker";
import { StopMarker } from "../components/StopMarker";
import ApiService from "../services/ApiService";
import { toast } from "react-toastify";
import "./Map.css";

const Map: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const buses = useQuery("buses", () => ApiService.getBuses(), {
    refetchInterval: 5000,
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
      refetchInterval: 5000,
    }
  );

  useIonViewDidEnter(() => {
    window.dispatchEvent(new Event("resize"));
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
                icon={BusMarker(
                  buses.data[key].label,
                  buses.data[key].type === "Autobusy Elektryczne"
                )}
                position={{
                  lat: buses.data[key].lat,
                  lng: buses.data[key].lon,
                }}
              ></Marker>
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
                >
                  <Popup>{stops.data[key].name}</Popup>
                </Marker>
              ))}
          </MarkerClusterGroup>
        </MapContainer>
      </IonContent>
      <IonModal
        isOpen={modalOpen}
        swipeToClose={true}
        breakpoints={[0.1, 0.5, 1]}
        initialBreakpoint={0.5}
        onDidDismiss={() => setModalOpen(false)}
      >
        <IonContent>
          <IonList>
            {departures.data && Object.keys(departures.data).length > 0 ? (
              <IonItem>                                                #TODO convert timestamp
                <IonLabel>[{selectedStop}] {departures.data[0]?.stop} {departures.dataUpdatedAt}</IonLabel>
              </IonItem>
            ) : null}

            {departures.data &&
              Object.keys(departures.data).map((key, index) => (
                <IonItem key={index}>
                  <IonLabel>
                    {departures.data[key].line}{" "}
                    {departures.data[key].destination}
                  </IonLabel>
                  {departures.data[key].time}
                </IonItem>
              ))}
          </IonList>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Map;
