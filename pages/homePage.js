import BasePage from "./basePage.js";
export default class HomePage extends BasePage {
  constructor(id, services) {
    super(id, services);
    this._id = id;
    this._router = services.router;
    this._elem = "";
  }

  get id() {
    return this._id;
  }

  renderTo(elem) {
    elem.innerHTML = "";
    elem.append(this._elem);
  }

  init() {
    this._elem = this._initHtml();
  }

  destroy() {}

  _initHtml() {
    const root = document.getElementById("root");

    // Create menu
    const menu = document.createElement("div");
    menu.className = "menu";
    root.appendChild(menu);

    // With button "Game"
    const gameButton = document.createElement("button");
    gameButton.className = "menu-button";
    gameButton.id = "game-button";
    gameButton.innerText = "Game";
    gameButton.onclick = () => {
      this._router.redirect("game");
    };
    menu.appendChild(gameButton);

    // And button "Settings"
    const settingsButton = document.createElement("button");
    settingsButton.className = "menu-button";
    settingsButton.id = "settings-button";
    settingsButton.innerText = "Settings";
    settingsButton.onclick = () => {
      this._router.redirect("settings");
    };
    menu.appendChild(settingsButton);

    return menu;
  }
}
