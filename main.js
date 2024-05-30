import { DobbleDeckGenerator } from "./deckGenerator.js";
import { GeolocationService } from "./geolocationService.js";
import { DobbleGame } from "./dobbleGame.js";
import BasePage from "./pages/basePage.js";
import Router from "./router.js";
import GamePage from "./pages/gamePage.js";
import HomePage from "./pages/homePage.js";
import SettingsPage from "./pages/settingsPage.js";
import { ScoreStorage, SettingsStorage } from "./dataStorage.js";
import ScoresPage from "./pages/scoresPage.js";

(async () => {
  const root = document.getElementById("root");
  const locationService = new GeolocationService();
  locationService.getCoords().then(coords => {
    console.log(coords);
    // TODO use coords, e.g. get city name from coords
  });

  const settingsStorage = new SettingsStorage();
  const settings = settingsStorage.get()
  const scoreStorage = new ScoreStorage(settings.cardsNumber);

  const dobbleDeckGenerator = new DobbleDeckGenerator(8, settings.cardsNumber);

  const game = new DobbleGame({ scoreStorage, settingsStorage, dobbleDeckGenerator });

  const defaultPageId = "home";
  const router = new Router(root, defaultPageId);
  const pages = [
    new HomePage(defaultPageId, { router }),
    new GamePage("game", { router }, game),
    new SettingsPage("settings", { router, settingsStorage }),
    new ScoresPage("scores", { router, scoreStorage }),
  ];
  pages.forEach(p => router.route(p));
  router.start();
})();
