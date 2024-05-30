import BasePage from "./basePage.js";
export default class ScoresPage extends BasePage {
  constructor(id, services) {
    super(id, services);
    this._id = id;
    this._router = services.router;
    this._scoreStorage = services.scoreStorage;
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

  destroy() {}

  _initHtml() {
    const root = document.getElementById("root");

    // Create menu
    const menu = document.createElement("div");
    menu.className = "menu";
    menu.style.overflow = "scroll";
    root.appendChild(menu);

    const divForTable = document.createElement("div");
    divForTable.className = "div-for-table";
    menu.appendChild(divForTable);

    const scores = this._scoreStorage.get();
    const scoresTable = document.createElement("table");
    scoresTable.className = "scores-table";
    divForTable.appendChild(scoresTable);

    const header = document.createElement("tr");
    scoresTable.appendChild(header);

    const headerCell = document.createElement("th");
    headerCell.innerText = "Date";
    header.appendChild(headerCell);

    const headerCell2 = document.createElement("th");
    headerCell2.innerText = "Score";
    header.appendChild(headerCell2);

    const headerCell3 = document.createElement("th");
    headerCell3.innerText = "# cards";
    header.appendChild(headerCell3);

    scores.reverse().forEach(score => {
      const row = document.createElement("tr");
      scoresTable.appendChild(row);

      const cell = document.createElement("td");
      cell.innerText = new Date(score.date).toLocaleString();
      row.appendChild(cell);

      const cell2 = document.createElement("td");
      cell2.innerText = score.score;
      row.appendChild(cell2);

      const cell3 = document.createElement("td");
      cell3.innerText = score.cardsNumber;
      row.appendChild(cell3);
    });


    return menu;
  }
}
