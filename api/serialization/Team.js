export default class TeamSerializer {
  constructor(team) {
    this.id = team.id;
    this.abbreviation = team.abbreviation;
    this.firstName = team.firstName;
    this.lastName = team.lastName;
    this.league = team.league;
    this.conference = team.conference;
    this.division = team.division;
  }

  serialize() {
    return {
      id: this.id,
      abbreviation: this.abbreviation,
      firstName: this.firstName,
      lastName: this.lastName,
      league: this.league,
      conference: this.conference,
      division: this.division,
    };
  };
}
