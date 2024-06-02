export class DobbleDeckGenerator {
  constructor(symbolsPerCard = 8, limitNumberOfCards = 57) {
    this.permutations = [];

    // TODO try with 6 cards (css angle different)
    this.symbolsPerCard = symbolsPerCard;
    this.numberOfCards = 0;
    this.cards = [];
    /** How many cards are in a game */
    this.limitNumberOfCards = limitNumberOfCards;

    this.generatePermutations();
  }

  resetLimitNumberOfCards(limitNumberOfCards) {
    this.limitNumberOfCards = limitNumberOfCards;
  }

  getDeck() {
    return this._shuffle(this.cards).slice(0, this.limitNumberOfCards);
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

  /** Code was taken from https://github.com/Darkseal/dobble/blob/master/dobble.js, and been modified */
  // TODO make js generator
  generatePermutations() {
    // const isEnoughCards = () => {
    //   return this.numberOfCards >= this.limitNumberOfCards;
    // };
    const N = this.symbolsPerCard;
    for (let i = 0; i <= N - 1; i++) {
      const s = [];
      this.numberOfCards++;
      s.push(1);
      for (let i2 = 1; i2 <= N - 1; i2++) {
        s.push(N - 1 + (N - 1) * (i - 1) + (i2 + 1));
      }
      this.cards.push(s);
      // if (isEnoughCards()) return;
    }
    for (let i = 1; i <= N - 1; i++) {
      for (let i2 = 1; i2 <= N - 1; i2++) {
        const s = [];
        this.numberOfCards++;
        s.push(i + 1);
        for (let i3 = 1; i3 <= N - 1; i3++) {
          s.push(
            N +
              1 +
              (N - 1) * (i3 - 1) +
              (((i - 1) * (i3 - 1) + (i2 - 1)) % (N - 1))
          );
        }
        this.cards.push(s);
        // if (isEnoughCards()) return;
      }
    }
  }
}
