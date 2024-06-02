export class LocationFetchError extends Error {
    constructor(msg, cause) {
      super(msg);
      this.cause = cause;
      this.name = "Location Coordinates Fetch Failed";
    }
  } 