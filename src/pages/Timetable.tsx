import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import "./Timetable.css";

const Timetable: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Rozkład Jazdy</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Rozkład Jazdy</IonTitle>
          </IonToolbar>
        </IonHeader>
        <iframe src="https://www.rozkladzik.pl/zielona_gora/" />
      </IonContent>
    </IonPage>
  );
};

export default Timetable;
