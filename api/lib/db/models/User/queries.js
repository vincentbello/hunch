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
      userId: {
        description: 'User ID to get friends for. If not provided, default to current user',
        type: GraphQLInt,
      },
      filterInput: {
        description: 'String input to filter users by',
        type: GraphQLString,
      },
    },
    resolve: async function(root, args, context, info) {
      switch (args.userListType) {
        case 'FRIENDS':
          return await models.User.getFriends(args.userId ? args.userId : context.userId);

        case 'FRIEND_REQUESTS':
          return await models.User.getFriendRequests(context.userId);

        case 'ALL_USERS':
          return await models.User.findAll({
            where: {
              [Op.or]: {
                firstName: { [Op.like]: `${args.filterInput}%` },
                lastName: { [Op.like]: `${args.filterInput}%` },
              },
            },
          });

        default:
          throw new Error();
      }
    },
  },

  user: {
    type: UserType,
    args: {
      id: {
        description: 'ID of user',
        type: GraphQLInt,
      },
    },
    resolve: (root, args, context) => models.User.findById(args.id || context.userId),
  },

  userStats: {
    type: UserStatsType,
    args: {
      userId: {
        description: 'ID of user',
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: (_, args, context) => ({ userId: args.userId, meId: context.userId }),
  },
});
