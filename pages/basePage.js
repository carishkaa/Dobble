export default class BasePage {
  constructor(id, services) {
    this._id = id;
    this._services = services;
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

  init() {}

  destroy() {}
}
