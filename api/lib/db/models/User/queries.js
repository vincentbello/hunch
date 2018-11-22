import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import UserType, { UserListType, UserStatsType } from './type';

export default models => ({
  users: {
    type: new GraphQLList(UserType),
    args: {
      userListType: {
        description: 'User list type',
        type: UserListType,
      },
    },
    resolve: async function(root, args, context, info) {
      return await models.User.getFriends(context.userId);
    },
  },

  userStats: {
    type: UserStatsType,
    args: {
      userId: {
        description: 'ID of user',
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: async function(root, args, context, info) {
      const [betsWon, betsPlayed] = await Promise.all([
        models.Bet.count({
          where: {
            winnerId: args.userId,
          },
        }),
        models.Bet.count({
          where: {
            accepted: true,
            active: false,
            [Op.or]: {
              bettorId: args.userId,
              betteeId: args.userId,
            },
          },
        }),
      ]);
      return { betsWon, betsPlayed };
    },
  },
});
