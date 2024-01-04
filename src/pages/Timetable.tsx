import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import { useRef } from "react";
import "./Timetable.css";

const Timetable: React.FC = () => {
  const refIframe = useRef<any>();
  const url = "https://www.m2.rozkladzik.pl/zielona_gora/rozklad_jazdy.html";

  const backToHomePage = () => {
    refIframe.current.src = url;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={backToHomePage}>Powrót</IonButton>
          </IonButtons>
          <IonTitle>Rozkład Jazdy</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <iframe ref={refIframe} title="rozkladzik" src={url} />
      </IonContent>
    </IonPage>
  );
};

export default Timetable;
