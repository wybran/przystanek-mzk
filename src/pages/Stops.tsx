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
  useIonViewWillEnter,
} from "@ionic/react";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router";
import ApiService from "../services/ApiService";
import { getAllKeys, remove, set } from "../data/IonicStorage";
import { star, starOutline } from "ionicons/icons";

const Stops: React.FC = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState("");
  const [filteredStops, setFilteredStops] = useState<any[]>([]);
  const [favouriteStops, setFavouriteStops] = useState<any[]>([]);
  const [stops, setStops] = useState<any[]>([]);

  useQuery("stops", ApiService.getStops, {
    onSuccess: async (data) => {
      const keys = await getAllKeys();
      let array = Object.values(data);
      array.findIndex((stop: any) => {
        if (keys.includes(stop.id)) {
          array = [stop, ...array.filter((item: any) => item.id !== stop.id)];
        }
      });
      setStops(array);
    },
  });

  useIonViewWillEnter(async () => {
    await getAllFavoriteStops();
  });

  const getAllFavoriteStops = async () => {
    const keys = await getAllKeys();
    if (keys) {
      setFavouriteStops(keys);
    }
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
          {filteredStops.length <= 0 && stops.length > 0 &&
            stops.map((stop, index) => (
              <IonItem key={index}>
                <IonLabel onClick={() => history.push("map", { stop: stop })}>
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
                  onClick={() =>
                    history.push("map", {
                      stop: stop,
                    })
                  }
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
    </IonPage>
  );
};

export default Stops;
