import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router";
import ApiService from "../services/ApiService";

const Stops: React.FC = () => {
  const history = useHistory();
  const stops = useQuery("stops", ApiService.getStops);
  const [searchText, setSearchText] = useState("");
  const [filteredStops, setFilteredStops] = useState<any | null>(null);

  const handleSearch = (e: any) => {
    setSearchText(e);
    setFilteredStops(
      Object.keys(stops.data).filter((key) =>
        stops.data[key].name.toLowerCase().includes(e.toLowerCase())
      )
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista przystanków</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            onIonChange={(e) => handleSearch(e.detail.value)}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonText color="success" class="ion-text-center">
          <h5>Kliknij w nazwę przystanku aby zobaczyć jego odjazdy</h5>
        </IonText>
        <IonList>
          {!filteredStops &&
            stops.data &&
            Object.keys(stops.data).map((key, index) => (
              <IonItem
                key={index}
                onClick={() => history.push("map", { stop: stops.data[key] })}
              >
                <IonLabel>
                  🚏 [{stops.data[key].id}] {stops.data[key].name}
                </IonLabel>
              </IonItem>
            ))}

          {filteredStops &&
            Object.keys(filteredStops).map((key, index) => (
              <IonItem
                key={index}
                onClick={() => history.push("map", { stop: stops.data[key] })}
              >
                <IonLabel>
                  🚏 [{stops.data[filteredStops[key]].id}] {stops.data[filteredStops[key]].name}
                </IonLabel>
              </IonItem>
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Stops;
