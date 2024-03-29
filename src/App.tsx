import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { busOutline, calendarOutline, mapOutline } from "ionicons/icons";
import Map from "./pages/Map";
import Timetable from "./pages/Timetable";
import Stops from "./pages/Stops";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { useEffect } from "react";
import { createStore } from "./data/IonicStorage";

setupIonicReact();

const App: React.FC = () => {

  useEffect(() => {
    const options: BannerAdOptions = {
      adId: 'ca-app-pub-8487255892576881/3052275223',
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 100,
      isTesting: false
    };

    AdMob.initialize().then(() => {
      AdMob.showBanner(options);
    })

    const setupStore = async () => {
      await createStore("mzkDB");
    };
    setupStore();
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/map">
              <Map />
            </Route>
            <Route exact path="/timetable">
              <Timetable />
            </Route>
            <Route exact path="/stops">
              <Stops />
            </Route>
            <Route exact path="/">
              <Redirect to="/map" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="map" href="/map">
              <IonIcon icon={mapOutline} />
              <IonLabel>Mapa</IonLabel>
            </IonTabButton>
            <IonTabButton tab="timetable" href="/timetable">
              <IonIcon icon={calendarOutline} />
              <IonLabel>Rozkład jazdy</IonLabel>
            </IonTabButton>
            <IonTabButton tab="stops" href="/stops">
              <IonIcon icon={busOutline} />
              <IonLabel>Przystanki</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
      <ToastContainer />
    </IonApp>
  );
};

export default App;
