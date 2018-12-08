export default class gameFormatter {
  static formatAndSeries(game) {
    if (game.format === 'advanced/other' || !game.format) {
      return '';
    }
    return ` | ${game.format} - ${this.shortFormSeries(game)}`;
  }

  static shortFormSeries(game) {
    if (!game.series) return '';
    return game.series.replace('best of one', 'Bo1')
      .replace('best of three', 'Bo3')
      .replace('best of five', 'Bo5')
      .replace('single match', 'single')
      .replace('two matches', 'double')
      .replace(' w/draw', '*');
  }
}
