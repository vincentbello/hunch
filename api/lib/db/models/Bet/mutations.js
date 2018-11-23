import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { isBefore } from 'date-fns';
import { Op } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import BetType, { BetListType } from './type';
import { ForbiddenError } from '../../../utils/apollo/errors';

export default models => ({
  cancelBetRequest: {
    type: new GraphQLNonNull(GraphQLInt),
    args: {
      id: {
        description: 'ID of bet',
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: async function (_, { id }) {
      await models.Bet.destroy({ where: { id } });
      return id;
    },
  },

  createBetRequest: {
    type: BetType,
    args: {
      amount: {
        description: 'Bet amount',
        type: new GraphQLNonNull(GraphQLInt),
      },
      betteeId: {
        description: 'ID of bettee',
        type: new GraphQLNonNull(GraphQLInt),
      },
      gameId: {
        description: 'ID of game',
        type: new GraphQLNonNull(GraphQLInt),
      },
      bettorPickTeamId: {
        description: 'ID of bettor\'s picked team',
        type: new GraphQLNonNull(GraphQLInt),
      },
      type: {
        description: 'Type of bet',
        type: new GraphQLNonNull(GraphQLString),
      },
      wager: {
        description: 'Bet wager',
        type: GraphQLString,
      },
    },
    resolve: async function (_, { amount, betteeId, gameId, bettorPickTeamId, type, wager }, context, ...args) {
      const newBet = await models.Bet.create({
        type,
        amount,
        wager,
        active: false,
        lastRemindedAt: new Date(),
        gameId,
        bettorId: context.userId,
        betteeId: betteeId,
        bettorPickTeamId,
      });
      const bet = await models.Bet.findById(newBet.id, {
        include: [
          { model: models.Game, as: 'game' },
          { model: models.User, as: 'bettor' },
          { model: models.User, as: 'bettee' },
        ],
      });
      bet.sendRequestNotifications();
      return bet;
    },
  },

  remindBetRequest: {
    type: BetType,
    args: {
      id: {
        description: 'ID of bet',
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: async function(root, { id }, ...args) {
      const bet = await models.Bet.findById(id);
      await models.Bet.update({ lastRemindedAt: new Date() }, { where: { id } });
      bet.sendRequestNotifications(true);
      return bet;
    },
  },

  respondToBet: {
    type: BetType,
    args: {
      id: {
        description: 'ID of bet',
        type: new GraphQLNonNull(GraphQLInt),
      },
      accepted: {
        description: 'Whether the bet was accepted or not',
        type: new GraphQLNonNull(GraphQLBoolean),
      },
    },
    resolve: async function(root, { id, accepted }, ...args) {
      const bet = await models.Bet.findById(id, { include: [{ model: models.Game, as: 'game' }] });
      if (isBefore(bet.game.startDate, new Date())) throw new ForbiddenError('This bet\'s game has already started.');

      await bet.update({ accepted, active: accepted, responded: true });
      bet.sendResponseNotifications();
      return bet;
    },
  },
});
