import { GraphQLEnumType, GraphQLInt, GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';
import { Op } from 'sequelize';
import models from '../';

export const UserStatsType = new GraphQLObjectType({
  name: 'UserStats',
  description: 'Statistics around a user\'s performance',
  fields: {
    won: {
      type: GraphQLInt,
      description: 'Number of bets won',
      async resolve({ userId }) {
        return await models.Bet.count({ where: { winnerId: userId } });
      },
    },
    played: {
      type: GraphQLInt,
      description: 'Number of bets played',
      async resolve({ userId }) {
        return await models.Bet.count({
          where: {
            accepted: true,
            active: false,
            [Op.or]: {
              bettorId: userId,
              betteeId: userId,
            },
          },
        });
      },
    },
    amountWon: {
      type: GraphQLInt,
      description: 'Total amount won on bets',
      async resolve({ userId }) {
        return await models.Bet.sum('amount', { where: { winnerId: userId } }) || 0;
      },
    },
    amountLost: {
      type: GraphQLInt,
      description: 'Total amount lost on bets',
      async resolve({ userId }) {
        return await models.Bet.sum('amount', {
          where: {
            accepted: true,
            active: false,
            [Op.or]: {
              bettorId: userId,
              betteeId: userId,
            },
            winnerId: {
              [Op.ne]: userId,
            },
          },
        }) || 0;
      },
    },
  },
});

export const UserListType = new GraphQLEnumType({
  name: 'UserListType',
  description: 'Types of user lists',
  values: {
    FRIENDS: { description: 'Friends of the authenticated user' },
  },
});

export default new GraphQLObjectType({
  name: 'User',
  description: 'A Hunch user',
  fields: {
    ...attributeFields(models.User),
    stats: {
      type: UserStatsType,
      description: 'Stats for this user',
      resolve: () => ({}),
    },
  },
});
