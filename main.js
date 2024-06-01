import { DobbleDeckGenerator } from "./deckGenerator.js";
import { GeolocationService, OnlineService } from "./geolocationService.js";
import { DobbleGame } from "./dobbleGame.js";
import Router from "./router.js";
import GamePage from "./pages/gamePage.js";
import HomePage from "./pages/homePage.js";
import SettingsPage from "./pages/settingsPage.js";
import { ScoreStorage, SettingsStorage } from "./dataStorage.js";
import ScoresPage from "./pages/scoresPage.js";

(async () => {
  const root = document.getElementById("root");
  const locationService = new GeolocationService();
  const settingsStorage = new SettingsStorage();
  const settings = settingsStorage.get()
  const scoreStorage = new ScoreStorage(settings.cardsNumber);
  const onlineService = new OnlineService();

  const defaultPageId = "home";
  const router = new Router(root, defaultPageId);

  const dobbleDeckGenerator = new DobbleDeckGenerator(8, settings.cardsNumber);
  const game = new DobbleGame({ scoreStorage, settingsStorage, dobbleDeckGenerator, router });

  const pages = [
    new HomePage(defaultPageId, { router }),
    new GamePage("game", { router }, game),
    new SettingsPage("settings", { router, settingsStorage, onlineService, locationService }),
    new ScoresPage("scores", { router, scoreStorage }),
  ];
  pages.forEach(p => router.route(p));
  router.start();
})();
