import BasePage from "./basePage.js";
export default class GamePage extends BasePage {
  constructor(id, services, game) {
    super(id, services);
    this._id = id;
    this._services = services;
    this._router = services.router;
    this._elem = "";
    this._game = game;
  }

  get id() {
    return this._id;
  }

  displayContent(elem) {
    elem.innerHTML = "";
    elem.append(this._elem);
  }

  init() {
    this._elem = this._initHtml();
    this._game.start();
  }

  destroy() {}

  _initHtml() {
    const root = document.getElementById("root");

    const game = document.createElement("div");
    game.className = "game";
    game.id = "game";
    root.appendChild(game);

    const main = document.createElement("div");
    main.id = "main";
    main.className = "container";
    game.appendChild(main);

    for (let i = 1; i <= 8; i++) {
      const iconContainer = document.createElement("div");
      iconContainer.className = "icon-container";
      if (i === 1) {
        iconContainer.className += " center";
      }
      iconContainer.id = `icon-container-${i}`;
      main.appendChild(iconContainer);
    }

    const main2 = document.createElement("div");
    main2.id = "main2";
    main2.className = "container";
    game.appendChild(main2);

    const result = document.createElement("div");
    result.id = "result";
    game.appendChild(result);

    const score = document.createElement("b");
    score.innerHTML = "Score: <span id='score'>0</span>";
    result.appendChild(score);
    return game;
  }
}
