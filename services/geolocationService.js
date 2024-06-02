import { LocationFetchError } from "./errors.js";

export class GeolocationService {
  constructor() {
    this._coords = { lat: 0, lng: 0 };
    this._lastRefresh = 0;
    this._ready = false;
    this._refreshInMs = 30 * 60 * 1000; // 30 minutes
  }

  /**
   * Retrieves the current position of the user
   * @returns {Promise<Position>} A promise that resolves with the current position.
   * @throws {LocationFetchError} If the location could not be fetched.
   */
  async getCoords() {
    if (this._ready && Date.now() - this._lastRefresh < this._refreshInMs) {
      return { ...this._coords };
    }

    if (!navigator.geolocation) {
      throw new LocationFetchError("Geolocation is not supported by your browser");
    }

    try {
      const pos = await this._getCurrentPosition();
      this._lastRefresh = new Date().getTime();
      this._coords.lat = pos.coords.latitude;
      this._coords.lng = pos.coords.longitude;
      this._ready = true;
      return { ...this._coords };
    } catch (e) {
      throw new LocationFetchError(e.message);
    }
  }

  async _getCurrentPosition() {
    return new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );
  }
}

export class OnlineService {
  isOnline (){
      return navigator.onLine
  }

  addOnlineEvent(onlineEventHandler) {
      window.addEventListener('online', onlineEventHandler);
  }

  addOfflineEvent(offlineEventHandler) {
      window.addEventListener('offline', offlineEventHandler);
  }
}
