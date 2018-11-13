export default class TeamSerializer {
  constructor(team) {
    this.id = team.id;
    this.abbreviation = team.abbreviation;
    this.firstName = team.firstName;
    this.lastName = team.lastName;
    this.imageUrl = team.imageUrl;
    this.league = team.league;
    this.conference = team.conference;
    this.division = team.division;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  serialize() {
    return {
      id: this.id,
      abbreviation: this.abbreviation,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      imageUrl: this.imageUrl,
      league: this.league,
      conference: this.conference,
      division: this.division,
    };
  };
}
