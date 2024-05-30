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

  getDeck() {
    return this.cards;
  }

  /** Code was taken from https://github.com/Darkseal/dobble/blob/master/dobble.js, and been modified */
  // TODO make js generator
  generatePermutations() {
    const isEnoughCards = () => {
      console.log('isEnoughCards', this.numberOfCards, this.limitNumberOfCards)
      return this.numberOfCards >= this.limitNumberOfCards;
    };
    const N = this.symbolsPerCard;
    for (let i = 0; i <= N - 1; i++) {
      const s = [];
      this.numberOfCards++;
      s.push(1);
      for (let i2 = 1; i2 <= N - 1; i2++) {
        s.push(N - 1 + (N - 1) * (i - 1) + (i2 + 1));
      }
      this.cards.push(s);
      if (isEnoughCards()) return;
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
        if (isEnoughCards()) return;
      }
    }
  }
}
