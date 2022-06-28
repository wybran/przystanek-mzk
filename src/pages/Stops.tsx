import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonModal,
  useIonViewWillEnter,
} from "@ionic/react";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router";
import ApiService from "../services/ApiService";
import { getAllKeys, remove, set } from "../data/IonicStorage";
import { star, starOutline, arrowBackCircle } from "ionicons/icons";
import Timestamp from "../utils/Timestamp";

const Stops: React.FC = () => {
  const history = useHistory<any>();
  const [searchText, setSearchText] = useState("");
  const [filteredStops, setFilteredStops] = useState<any[]>([]);
  const [favouriteStops, setFavouriteStops] = useState<any[]>([]);
  const [stops, setStops] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStop, setSelectedStop] = useState<any | null>(null);

  useQuery("stops", ApiService.getStops, {
    onSuccess: async (data) => {
      let array = Object.values(data);
      const keys = await getAllKeys();
      if (keys) {
        setFavouriteStops(keys);
      }
      // eslint-disable-next-line
      array.findIndex((stop: any) => {
        if (keys.includes(stop.id)) {
          array = [stop, ...array.filter((item: any) => item.id !== stop.id)];
        }
      });
      setStops(array);
    },
  });

  const departures = useQuery(
    ["departures", selectedStop],
    ({ queryKey }) => ApiService.getDepartures(queryKey[1]),
    {
      refetchInterval: 10000,
    }
  );

  useIonViewWillEnter(async () => {
    if (history.location.state?.stop) {
      setSelectedStop(history.location.state.stop);
      setModalOpen(true);
      history.replace("stops", { stop: null });
    }
  });

  const getAllFavoriteStops = async () => {
    const keys = await getAllKeys();
    if (keys) {
      setFavouriteStops(keys);
    }
    let array = Object.values(stops);
    stops.findIndex((stop: any) => {
      if (keys.includes(stop.id)) {
        array = [stop, ...array.filter((item: any) => item.id !== stop.id)];
      }
    });
    setStops(array);
  };

  const addToFavourite = async (stop: any) => {
    await set(stop.id, stop);
    await getAllFavoriteStops();
  };

  const removeFromFavourite = async (stop: any) => {
    await remove(stop.id);
    await getAllFavoriteStops();
  };

  const isFavorite = (stop: any): boolean => {
    const keys = favouriteStops;
    if (keys.includes(stop.id)) {
      return true;
    } else {
      return false;
    }
  };

  const handleSearch = (e: any) => {
    setSearchText(e);
    setFilteredStops(
      stops.filter((key) => key.name.toLowerCase().includes(e.toLowerCase()))
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
          {filteredStops.length <= 0 &&
            stops.length > 0 &&
            stops.map((stop, index) => (
              <IonItem key={index}>
                <IonLabel
                  onClick={() => {
                    setSelectedStop(stop);
                    setModalOpen(true);
                  }}
                >
                  🚏 [{stop.id}] {stop.name}
                </IonLabel>
                {isFavorite(stop) ? (
                  <IonIcon
                    icon={star}
                    color="danger"
                    onClick={() => removeFromFavourite(stop)}
                  />
                ) : (
                  <IonIcon
                    icon={starOutline}
                    color="success"
                    onClick={() => addToFavourite(stop)}
                  />
                )}
              </IonItem>
            ))}

          {filteredStops &&
            filteredStops.map((stop, index) => (
              <IonItem key={index}>
                <IonLabel
                  onClick={() => {
                    setSelectedStop(stop);
                    setModalOpen(true);
                  }}
                >
                  🚏 [{stop.id}] {stop.name}
                </IonLabel>
                {isFavorite(stop) ? (
                  <IonIcon
                    icon={star}
                    color="danger"
                    onClick={() => removeFromFavourite(stop)}
                  />
                ) : (
                  <IonIcon
                    icon={starOutline}
                    color="success"
                    onClick={() => addToFavourite(stop)}
                  />
                )}
              </IonItem>
            ))}
        </IonList>
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
                [{selectedStop.id}] {departures.data[0]?.stop}{" "}
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
          {selectedStop && isFavorite(selectedStop) ? (
            <IonFab vertical="bottom" horizontal="center" slot="fixed">
              <IonFabButton onClick={() => removeFromFavourite(selectedStop)}>
                <IonIcon icon={star} />
              </IonFabButton>
            </IonFab>
          ) : (
            <IonFab vertical="bottom" horizontal="center" slot="fixed">
              <IonFabButton onClick={() => addToFavourite(selectedStop)}>
                <IonIcon icon={starOutline} />
              </IonFabButton>
            </IonFab>
          )}
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Stops;
