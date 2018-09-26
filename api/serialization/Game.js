import TeamSerializer from './Team';

export default class GameSerializer {
  constructor(game) {
    this.id = game.id;
    this.league = game.league;
    this.season = game.season;
    this.seasonType = game.seasonType;
    this.completed = game.completed;
    this.homeScore = game.homeScore;
    this.awayScore = game.awayScore;
    this.week = game.week;
    this.startDate = game.startDate;
    this.homeTeam = game.homeTeam;
    this.awayTeam = game.awayTeam;
  }

  serializeTeam = (isHome = false) => {
    const prefix = isHome ? 'home' : 'away';
    const team = this[`${prefix}Team`];

    if (!team) return null;

    const score = this[`${prefix}Score`];
    const otherScore = this[`${isHome ? 'away' : 'home'}Score`];
    return {
      ...new TeamSerializer(team).serialize(),
      isWinner: this.completed && score > otherScore,
      score,
    };
  };

  serialize() {
    return {
      id: this.id,
      league: this.league,
      season: this.season,
      seasonType: this.seasonType,
      completed: this.completed,
      week: this.week,
      startDate: this.startDate,
      homeTeam: this.serializeTeam(true),
      awayTeam: this.serializeTeam(),
    };
  };
}
