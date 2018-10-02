import GameSerializer from './Game';
import UserSerializer from './User';

export default class BetSerializer {
  constructor(bet) {
    this.id = bet.id;
    this.type = bet.type;
    this.amount = bet.amount;
    this.wager = bet.wager;
    this.responded = bet.responded;
    this.accepted = bet.accepted;
    this.active = bet.active;
    this.resolvedAt = bet.resolvedAt;
    this.game = bet.game;
    this.bettor = bet.bettor;
    this.bettee = bet.bettee;
    this.createdAt = bet.createdAt;
  }

  serializeParticipant = (isBettor = false) => {
    const user = this[isBettor ? 'bettor' : 'bettee'];
    if (!user) return null;

    return new UserSerializer(user).serialize();
  };

  serialize() {
    return {
      id: this.id,
      type: this.type,
      amount: this.amount,
      wager: this.wager,
      responded: this.responded,
      accepted: this.accepted,
      active: this.active,
      resolvedAt: this.resolvedAt,
      bettor: this.serializeParticipant(true),
      bettee: this.serializeParticipant(),
      game: this.game ? new GameSerializer(this.game).serialize() : null,
      createdAt: this.createdAt,
    };
  };
}
