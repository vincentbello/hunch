import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import BetType, { BetListType } from './type';

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
      }, {
        include: [
          { model: models.Game, as: 'game' },
          { model: models.User, as: 'bettor' },
          { model: models.User, as: 'bettee' },
        ],
      });
      newBet.sendRequestNotifications();
      return newBet;
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
      // TODO: Send Reminder
      await models.Bet.update({ lastRemindedAt: new Date() }, { where: { id } });
      return await resolver(models.Bet)(root, { id }, ...args);
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
      const bet = await models.Bet.findById(id);
      await bet.update({ accepted, active: accepted, responded: true });
      bet.sendResponseNotifications();
      return bet;
    },
  },
});
