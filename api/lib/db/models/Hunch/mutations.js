import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { isBefore } from 'date-fns';
import { Op } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import HunchType, { HunchListType } from './type';
import { ForbiddenError } from '../../../utils/apollo/errors';

export default models => ({
  cancelHunchRequest: {
    type: new GraphQLNonNull(GraphQLInt),
    args: {
      id: {
        description: 'ID of hunch',
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: async function (_, { id }) {
      await models.Hunch.destroy({ where: { id } });
      return id;
    },
  },

  createHunchRequest: {
    type: HunchType,
    args: {
      amount: {
        description: 'Hunch amount',
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
        description: 'Type of hunch',
        type: new GraphQLNonNull(GraphQLString),
      },
      wager: {
        description: 'Hunch wager',
        type: GraphQLString,
      },
    },
    resolve: async function (_, { amount, betteeId, gameId, bettorPickTeamId, type, wager }, context, ...args) {
      const newHunch = await models.Hunch.create({
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
      const hunch = await models.Hunch.findById(newHunch.id, {
        include: [
          { model: models.Game, as: 'game' },
          { model: models.User, as: 'bettor' },
          { model: models.User, as: 'bettee' },
        ],
      });
      hunch.sendRequestNotifications();
      return hunch;
    },
  },

  remindHunchRequest: {
    type: HunchType,
    args: {
      id: {
        description: 'ID of hunch',
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: async function(root, { id }, ...args) {
      const hunch = await models.Hunch.findById(id);
      hunch.lastRemindedAt = new Date();
      await hunch.save();
      hunch.sendRequestNotifications(true);
      return hunch;
    },
  },

  respondToHunch: {
    type: HunchType,
    args: {
      id: {
        description: 'ID of hunch',
        type: new GraphQLNonNull(GraphQLInt),
      },
      accepted: {
        description: 'Whether the hunch was accepted or not',
        type: new GraphQLNonNull(GraphQLBoolean),
      },
    },
    resolve: async function(root, { id, accepted }, ...args) {
      const hunch = await models.Hunch.findById(id, { include: [{ model: models.Game, as: 'game' }] });
      if (isBefore(hunch.game.startDate, new Date())) throw new ForbiddenError('This hunch\'s game has already started.');

      hunch.accepted = accepted;
      hunch.active = accepted;
      hunch.responded = true;
      await hunch.save();
      hunch.sendResponseNotifications();
      return hunch;
    },
  },
});
