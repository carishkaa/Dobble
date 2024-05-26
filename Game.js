export class DobbleGame {
  constructor(cards, symbolsPerCard = 8) {
    this.permutations = [];

    this.symbolsPerCard = symbolsPerCard;
    this.cards = cards;

    this.generatePermutations();
  }

  evaluate(card1, card2) {
    return card1.some(symbol => card2.includes(symbol));
  }

  /** for current step */
  calculateScore(solutionTimeMs, isCorrectAnswer) {
    if (isCorrectAnswer) {
      const maxMs = 20 * 1000; // 20 seconds
      return Math.round(1.5 * (maxMs - solutionTimeMs));
    }
    return -100;
  }

  // Todo think about timer. Score is calculated based on speed of the player.
  // Minus points for wrong answers.
}
