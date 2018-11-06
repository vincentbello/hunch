import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import UserType, { UserListType } from './type';

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
});
