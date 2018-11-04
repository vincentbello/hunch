import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import BetType, { BetListType } from './type';

export default models => ({
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
      // TODO: Send notifications
      await models.Bet.update({ accepted, active: accepted, responded: true }, { where: { id } });
      return await resolver(models.Bet)(root, { id, accepted }, ...args);
    },
  },
});
