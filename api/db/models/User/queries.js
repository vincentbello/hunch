import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import UserType, { UserListType } from './type';

export default models => ({
  users: {
    type: new GraphQLList(UserType),
    args: {
      userListType: {
        description: 'Bet list type',
        type: UserListType,
      },
    },
    resolve: resolver(models.User, {
      before: (findOptions, args, context) => ({
        ...findOptions,
        where: {
          FRIENDS: {
            active: true,
            id: {
              [Op.ne]: context.userId,
            },
          },
        }[args.userListType] || {},
      }),
    }),
  },
});
