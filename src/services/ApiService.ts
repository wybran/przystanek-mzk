import axios from "axios";

class ApiService {
  getStops() {
    return axios
      .get(
        "https://poland-public-transport.konhi.workers.dev/v1/zielonagora/mzk/stops/"
      )
      .then((response) => {
        return response.data;
      });
  }
  getBuses() {
    return axios
      .get(
        "https://poland-public-transport.konhi.workers.dev/v1/zielonagora/mzk/vehicles"
      )
      .then((response) => {
        return response.data;
      });
  }
  getInfo() {
    return axios
      .get(
        "https://poland-public-transport.konhi.workers.dev/v1/zielonagora/mzk/infos/"
      )
      .then((response) => {
        return response.data;
      });
  }
  getDepartures(id: any) {
    if (!id) return;
    
    return axios
      .get(
        `https://poland-public-transport.konhi.workers.dev/v1/zielonagora/mzk/stops/${id}/departures`
      )
      .then((response) => {
        return response.data;
      });
  }
}

export default new ApiService();
