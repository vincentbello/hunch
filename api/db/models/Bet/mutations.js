import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
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
    resolve: async function(root, { id }, context, info) {
      // TODO: Send Reminder
      await models.Bet.update({ lastRemindedAt: new Date() }, { where: { id } });
      return await resolver(models.Bet)(root, { id }, context, info);
    }
  },
});
