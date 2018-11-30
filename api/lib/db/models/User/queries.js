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

  user: {
    type: UserType,
    args: {
      id: {
        description: 'ID of user',
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: resolver(models.User),
  },

  userStats: {
    type: UserStatsType,
    args: {
      userId: {
        description: 'ID of user',
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: (_, { userId }) => ({ userId }),
  },
});
