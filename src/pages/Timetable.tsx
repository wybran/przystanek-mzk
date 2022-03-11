import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { homeOutline } from 'ionicons/icons';
import { useRef } from 'react';
import "./Timetable.css";

const Timetable: React.FC = () => {
  const refIframe = useRef<any>();
  const url = "http://www.m2.rozkladzik.pl/zielona_gora/index.html";

  const backToHomePage = () => {
    refIframe.current.src = url;
  }

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
        <iframe ref={refIframe} title="rozkladzik" src={url} />
        <IonFab vertical="bottom" horizontal="center" slot="fixed" onClick={backToHomePage}>
          <IonFabButton>
            <IonIcon icon={homeOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Timetable;
