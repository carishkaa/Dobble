export class DobbleGame {
  constructor(services) {
    this.permutations = [];

    this.symbolsPerCard = 8;
    this.deck = services.dobbleDeckGenerator.getDeck();

    this.filenames = this._shuffle(this._getFileNames());

    this.score = 0;
    this.currentDeckIdx = 0;

    this.timer = new Date().getTime();

    this.currentPrimary = this.deck[0];
    this._scoreStorage = services.scoreStorage;
    this._settingsStorage = services.settingsStorage;
    this._dobbleDeckGenerator = services.dobbleDeckGenerator;

    this._audio = {
      correct: new Audio("audio/correct.mp3"),
      bad: new Audio("audio/bad.wav"),
      gameEnd: new Audio("audio/game_end.wav"),
    };
  }

  start() {
    console.log("Game started ", this._settingsStorage.get().cardsNumber, " cards")
    this._dobbleDeckGenerator.resetLimitNumberOfCards(
      this._settingsStorage.get().cardsNumber
    );
    this.deck = this._dobbleDeckGenerator.getDeck();

    this._placeAllIconsPrimary(this.currentPrimary);
    this.timer = new Date().getTime();

    this.currentDeckIdx++;
    this._refreshCards(this.currentDeckIdx);
  }

  _evaluate(symbol, card) {
    return card.includes(symbol);
  }

  _recalculateScore({ isCorrectSolution }) {
    if (isCorrectSolution) {
      const scoringTime = new Date().getTime() - this.timer;
      const scoringTimeSeconds = scoringTime / 1000;
      this.timer = new Date().getTime();
      this.score += Math.round(1.5 * (45 - scoringTimeSeconds));
    } else {
      this.score -= 10;
    }
    if (this.score < 0) {
      this.score = 0;
    }
    const scoreElement = document.getElementById("score");
    scoreElement.innerHTML = this.score;
    return this.score;
  }

  _playAudio(audio) {
    if (audio === "correct") {
      this._audio.correct.currentTime = 0;
      this._audio.correct.playbackRate = 1.5;
      this._audio.correct.play();
    } else if (audio === "bad") {
      this._audio.bad.currentTime = 0;
      this._audio.bad.play();
    } else if (audio === "gameEnd") {
      this._audio.gameEnd.currentTime = 0;
      this._audio.gameEnd.play();
    }
  }

  _placeAllIconsPrimary(newDeckIndexes, oldDeckIndexes) {
    const iconContainers = document.querySelectorAll("#main .icon-container");
    const shuffledDeckIndexes = this._shuffle(newDeckIndexes);
    iconContainers.forEach((iconContainer, index) => {
      iconContainer.innerHTML = "";
      const icon = document.createElement("img");
      icon.src = `figures/${
        this._getPicturesByIdxs(shuffledDeckIndexes)[index]
      }`;
      icon.id = `icon-${shuffledDeckIndexes[index]}`;
      icon.width = 10;
      icon.height = 10;
      icon.className = "svg-icon";
      icon.onclick = () => {
        const symbolIdx = parseInt(icon.id.split("-")[1]);
        if (this._evaluate(symbolIdx, oldDeckIndexes)) {
          this._playAudio("correct");
          this._recalculateScore({ isCorrectSolution: true });
          this.currentDeckIdx += 1;
          this._refreshCards(this.currentDeckIdx);
        } else {
          this._playAudio("bad");
          this._recalculateScore({ isCorrectSolution: false });
          // Make animation
          icon.style.animation = "none";
          icon.offsetHeight; /* trigger reflow */
          icon.style.animation = "shake 0.2s";
        }
      };
      iconContainer.appendChild(icon);
    });

    const svgs = document.querySelectorAll("#main .svg-icon"); // img
    svgs.forEach(svg => this._scaleAndRotateRandomly(svg));
  }

  _refreshCards(deckIndex) {
    let primaryContainer = document.getElementById("main");
    // get all children of primaryContainer with class svg-icon
    let svgIcons = primaryContainer.getElementsByClassName("svg-icon");
    // remove all children's onclick event
    for (let i = 0; i < svgIcons.length; i++) {
      svgIcons[i].style.animation = "none";
    }

    if (this.deck[deckIndex] === undefined) {
      return this._endGame();
    }

    const secondaryContainer = document.getElementById("main2");
    secondaryContainer.innerHTML = primaryContainer.innerHTML;
    const previousPrimary = this.currentPrimary;
    this.currentPrimary = this.deck[deckIndex];
    this._placeAllIconsPrimary(this.currentPrimary, previousPrimary);
  }

  _endGame() {
    this._playAudio("gameEnd");
    // blur
    document.getElementById("main").style.filter = "blur(5px)";
    document.getElementById("main2").style.filter = "blur(3px)";

    // remove onclick
    let svgIcons = document.getElementsByClassName("svg-icon");
    for (let i = 0; i < svgIcons.length; i++) {
      svgIcons[i].onclick = () => {};
    }

    this._scoreStorage.set(this.score);

    const root = document.getElementById("root");

    // create modal window with button "Play again" and "Exit"
    const modal = document.createElement("div");
    modal.className = "menu";
    modal.id = "modal";
    root.appendChild(modal);

    const score = document.createElement("p");
    score.innerHTML = `Your score: ${this.score}`;
    modal.appendChild(score);

    const playAgainButton = document.createElement("button");
    playAgainButton.innerHTML = "Play again";
    playAgainButton.onclick = () => {
      this._restartGame();
    };

    const exitButton = document.createElement("button");
    exitButton.innerHTML = "Exit";
    exitButton.onclick = () => {
      window.location.href = "/";
    };
  }

  _scaleAndRotateRandomly(svg) {
    const size = this._getRandom(80, 117); // Adjust size range
    const angle = this._getRandom(0, 360);

    svg.style.width = `${size}px`;
    svg.style.height = `${size}px`; //scale
    svg.style.transform = ` rotate(${angle}deg)`;
  }

  _getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  _getPicturesByIdxs(idxs) {
    return idxs.map(idx => this.filenames[idx - 1]);
  }

  _shuffle(array) {
    const length = array == null ? 0 : array.length;
    if (!length) {
      return [];
    }
    let index = -1;
    const lastIndex = length - 1;
    const result = array;
    while (++index < length) {
      const rand = index + Math.floor(Math.random() * (lastIndex - index + 1));
      const value = result[rand];
      result[rand] = result[index];
      result[index] = value;
    }
    return result;
  }

  _getFileNames() {
    return [
      "hamburger-svgrepo-com.svg",
      "ladybeetle-svgrepo-com.svg",
      "bear-svgrepo-com.svg",
      "whitesun-svgrepo-com.svg",
      "knowledge-svgrepo-com.svg",
      "octopus-svgrepo-com.svg",
      "mapleleaf-svgrepo-com.svg",
      "ghost-svgrepo-com.svg",
      "trolleybus-svgrepo-com.svg",
      "cherry-svgrepo-com.svg",
      "spurtingwhale-svgrepo-com.svg",
      "trophy-prize-achievement-svgrepo-com.svg",
      "automobile-svgrepo-com.svg",
      "blackdroplet-svgrepo-com.svg",
      "birthdaycake-svgrepo-com.svg",
      "cupcake-svgrepo-com.svg",
      "crescentmoon-svgrepo-com.svg",
      "artistpalette-svgrepo-com.svg",
      "like-svgrepo-com.svg",
      "key-svgrepo-com.svg",
      "mushroom-svgrepo-com.svg",
      "mouse-svgrepo-com.svg",
      "icon.svg",
      "search-svgrepo-com.svg",
      "cabbage-svgrepo-com.svg",
      "taco-svgrepo-com.svg",
      "fire-svgrepo-com.svg",
      "cooking-svgrepo-com.svg",
      "graduation-cap-svgrepo-com.svg",
      "cowface-svgrepo-com.svg",
      "close-up-mode-svgrepo-com.svg",
      "dress-svgrepo-com.svg",
      "cocktail-svgrepo-com.svg",
      "doughnut-svgrepo-com.svg",
      "alarm-clock-svgrepo-com.svg",
      "passport-svgrepo-com.svg",
      "sunflower-svgrepo-com.svg",
      "pandaface-svgrepo-com.svg",
      "ambulance-svgrepo-com.svg",
      "sunbehindcloud-svgrepo-com.svg",
      "raspberry-svgrepo-com.svg",
      "pizza-svgrepo-com.svg",
      "whitetouchtonephone-svgrepo-com.svg",
      "honeybee-svgrepo-com.svg",
      "cheese-svgrepo-com.svg",
      "watermelon-svgrepo-com.svg",
      "gem-svgrepo-com.svg",
      "beach-ball-svgrepo-com.svg",
      "grapes-svgrepo-com.svg",
      "snowflake-svgrepo-com.svg",
      "turtle-svgrepo-com.svg",
      "hourglass-svgrepo-com.svg",
      "crystalball-svgrepo-com.svg",
      "tree-svgrepo-com.svg",
      "crab-svgrepo-com.svg",
      "snowmountains-svgrepo-com.svg",
      "lemon-svgrepo-com.svg",
    ];
  }
}
