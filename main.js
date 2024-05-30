import { DobbleDeckGenerator } from "./deckGenerator.js";
import { GeolocationService } from "./geolocationService.js";
import { DobbleGame } from "./dobbleGame.js";
import BasePage from "./pages/basePage.js";
import Router from "./router.js";
import GamePage from "./pages/gamePage.js";
import HomePage from "./pages/homePage.js";

(async () => {
  const root = document.getElementById("root");
  const locationService = new GeolocationService();
  locationService.getCoords().then(coords => {
    console.log(coords);
    // TODO use coords, e.g. get city name from coords
  });

  const dobbleDeckGenerator = new DobbleDeckGenerator(8, 57);
  const deck = dobbleDeckGenerator.getDeck();
  const game = new DobbleGame(deck);

  const defaultPageId = "home";
  const router = new Router(root, defaultPageId);
  const pages = [
    new HomePage(defaultPageId, { router }),
    new GamePage("game", { router: null }, game),
    new BasePage("about", { router: null }),
  ];
  pages.forEach(p => router.route(p));
  router.start();
})();
