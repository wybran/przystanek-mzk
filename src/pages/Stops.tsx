import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";
import { useQuery } from "react-query";
import ApiService from "../services/ApiService";

const Stops: React.FC = () => {
  const stops = useQuery("stops", ApiService.getStops);
  const [searchText, setSearchText] = useState("");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista przystanków</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            onIonChange={(e) => setSearchText(e.detail.value!)}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {stops.data &&
            Object.keys(stops.data).map((key, index) => (
              <IonItem key={index}>
                <IonLabel>[{stops.data[key].id}] {stops.data[key].name}</IonLabel>
              </IonItem>
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Stops;
