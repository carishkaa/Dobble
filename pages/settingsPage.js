import BasePage from "./basePage.js";
export default class SettingsPage extends BasePage {
  constructor(id, services) {
    super(id, services);
    this._id = id;
    this._router = services.router;
    this._settingsStorage = services.settingsStorage;
    this._onlineService = services.onlineService;
    this._locationService = services.locationService;
    this._elem = "";
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
  }

  _initHtml() {
    const root = document.getElementById("root");

    // Create menu
    const menu = document.createElement("div");
    menu.className = "menu";
    root.appendChild(menu);

    // Title "settings"
    const title = document.createElement("h1");
    title.innerHTML = "Settings";
    menu.appendChild(title);

    // Create form (input integer for cards number, toggle for sound on/off, submit button)
    const form = document.createElement("form");
    form.classList.add("settings-form");
    menu.appendChild(form);

    const backLink = document.createElement('a')
    backLink.onclick = () => this._router.redirect('home')
    backLink.classList.add('back-arrow')
    menu.appendChild(backLink)

    const settings = this._settingsStorage.get();

    // Create input for cards number
    const label = document.createElement("label");
    label.for = "cardsNumber";
    label.innerHTML = "Cards number";
    const cardsNumberInput = document.createElement("input");
    cardsNumberInput.type = "number";
    cardsNumberInput.id = "cardsNumber";
    cardsNumberInput.name = "cardsNumber";
    cardsNumberInput.min = "5";
    cardsNumberInput.max = "55";
    cardsNumberInput.value = settings.cardsNumber;
    form.appendChild(label);
    label.appendChild(cardsNumberInput);

    // Create label for sound
    const soundLabel = document.createElement("label");
    soundLabel.for = "sound";
    soundLabel.innerHTML = "Sound";
    form.appendChild(soundLabel);
    // Create toggle for sound on/off
    const sound = document.createElement("input");
    sound.type = "checkbox";
    sound.id = "sound";
    sound.name = "sound";
    sound.checked = settings.audioSound;
    soundLabel.appendChild(sound);

    // Create submit button
    const submit = document.createElement("button");
    submit.type = "submit";
    submit.innerHTML = "Save";
    submit.classList.add("menu-button");
    submit.addEventListener("click", e => {
      e.preventDefault();
      const cardsNumber = cardsNumberInput.value
        ? parseInt(cardsNumberInput.value)
        : 0;
      if (cardsNumber < 5 || cardsNumber > 55) {
        alert("Cards number should be between 5 and 55");
        return;
      }
      const audioSound = sound.checked;
      this._settingsStorage.set({ cardsNumber, audioSound });
      this._router.redirect("home");
    });
    form.appendChild(submit);

    const onlineData = document.createElement("ul");
    onlineData.classList.add("status-info");
    menu.appendChild(onlineData);
    const status = document.createElement("li");
    const coords = document.createElement("li");
    const quote = document.createElement("q");
    coords.className = "coords";

    const displayOnlineText = isOnline => {
      status.textContent =
        (isOnline ?? this._onlineService.isOnline()) === true
          ? ""
          : "Offline";
      coords.textContent = "loading...";
      quote.hidden = true;

      onlineData.innerHTML = "";
      onlineData.append(status, coords, quote);

      if (isOnline) {
        this._locationService
          .getCoords()
          .then(res => {
            coords.textContent = `${res.lat}, ${res.lng}`;
          })
          .catch(() => {
            coords.textContent = "Failed to fetch coordinates";
          });
        // Get quote
        fetch("https://api.quotable.io/random")
          .then(response => response.json())
          .then(data => {
            quote.hidden = false;
            console.log(quote.hidden)
            quote.textContent = data.content;
          })
          .catch(() => {
            quote.hidden = true;
          });
      } else {
        coords.textContent = "not available";
        quote.hidden = true;
      }
    };
    displayOnlineText(this._onlineService.isOnline());
    this._onlineService.addOnlineEvent(() => {
      displayOnlineText(true);
    });
    this._onlineService.addOfflineEvent(() => {
      displayOnlineText(false);
    });

    return menu;
  }
}
