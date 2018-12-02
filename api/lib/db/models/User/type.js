import { GraphQLEnumType, GraphQLInt, GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';
import { Op } from 'sequelize';
import models from '../';

const StatGroupType = new GraphQLObjectType({
  name: 'StatGroup',
  description: 'Group of statistics around a user\'s performance',
  fields: {
    won: {
      type: GraphQLInt,
      description: 'Number of bets won',
      async resolve({ meId, userId, type }) {
        if (type === 'AGAINST') {
          if (userId === meId) return 0;
          return await models.Bet.count({
            where: {
              winnerId: userId,
              [Op.or]: [
                { bettorId: meId, betteeId: userId },
                { bettorId: userId, betteeId: meId },
              ],
            },
          });
        }

        return await models.Bet.count({ where: { winnerId: userId } });
      },
    },

    played: {
      type: GraphQLInt,
      description: 'Number of bets played',
      async resolve({ meId, userId, type }) {
        if (type === 'AGAINST') {
          if (userId === meId) return 0;
          return await models.Bet.count({
            where: {
              accepted: true,
              active: false,
              [Op.or]: [
                { bettorId: meId, betteeId: userId },
                { bettorId: userId, betteeId: meId },
              ],
            },
          });
        }

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
      async resolve({ meId, userId, type }) {
        if (type === 'AGAINST') {
          if (userId === meId) return 0;
          return await models.Bet.sum('amount', {
            where: {
              winnerId: userId,
              [Op.or]: [
                { bettorId: meId, betteeId: userId },
                { bettorId: userId, betteeId: meId },
              ],
            },
          }) || 0;
        }

        return await models.Bet.sum('amount', { where: { winnerId: userId } }) || 0;
      },
    },

    amountLost: {
      type: GraphQLInt,
      description: 'Total amount lost on bets',
      async resolve({ meId, userId, type }) {
        if (type === 'AGAINST') {
          if (userId === meId) return 0;
          return await models.Bet.sum('amount', {
            where: {
              accepted: true,
              active: false,
              [Op.or]: [
                { bettorId: meId, betteeId: userId },
                { bettorId: userId, betteeId: meId },
              ],
              winnerId: {
                [Op.ne]: userId,
              },
            },
          }) || 0;
        }

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

export const UserStatsType = new GraphQLObjectType({
  name: 'UserStats',
  description: 'All statistics around a user\'s performance',
  fields: {
    overall: {
      type: StatGroupType,
      description: 'Group of stats on total bets',
      resolve: args => ({ ...args, type: 'OVERALL' }),
    },
    against: {
      type: StatGroupType,
      description: 'Group of stats on head to head bets',
      resolve: args => ({ ...args, type: 'AGAINST' }),
    },
  },
});

export const UserListType = new GraphQLEnumType({
  name: 'UserListType',
  description: 'Types of user lists',
  values: {
    FRIENDS: { description: 'Friends of user' },
    FRIEND_REQUESTS: { description: 'Incoming friend requests for user' },
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
    friendCount: {
      type: GraphQLInt,
      description: 'Number of friends for this user',
      resolve: async parentValue => await models.Friendship.count({
        where: {
          status: 'ACTIVE',
          [Op.or]: [
            { userId: parentValue.id },
            { friendId: parentValue.id },
          ],
        },
      }),
    },
  },
});
