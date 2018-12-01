import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import FriendshipType from './type';

export default models => ({
  userFriendship: {
    type: FriendshipType,
    args: {
      userId: {
        description: 'ID of other user in friendship',
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: resolver(models.Friendship, {
      before: (findOptions, args, context) => ({
        ...findOptions,
        where: {
          [Op.or]: [
            {
              userId: context.userId,
              friendId: args.userId,
            },
            {
              userId: args.userId,
              friendId: context.userId,
            },
          ],
        },
      }),
    }),
  },
});
