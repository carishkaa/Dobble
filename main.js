import { DobbleDeckGenerator } from "./permutationsGenerator.js";
import { GeolocationService } from "./geolocationService.js";
import { DobbleGame } from "./dobbleGame.js";

(async () => {
  const locationService = new GeolocationService()
  locationService.getCoords().then(coords => {
    console.log(coords)
    // TODO use coords, e.g. get city name from coords
  })

  const dobbleDeckGenerator = new DobbleDeckGenerator(8, 57);
  const deck = dobbleDeckGenerator.getDeck();

  const game = new DobbleGame(deck);
  game.start();

})();
