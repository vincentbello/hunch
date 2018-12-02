import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import FriendshipType, { FriendshipStatusType } from './type';

export default models => ({
  updateFriendshipStatus: {
    type: FriendshipType,
    args: {
      userId: {
        description: 'User ID to update friendship status for',
        type: new GraphQLNonNull(GraphQLInt),
      },
      status: {
        description: 'Status to update friendship to',
        type: FriendshipStatusType,
      },
    },
    resolve: async function(root, { userId, status }, context) {
      const [friendship, initialized] = await models.Friendship.findOrBuild({
        where: {
          [Op.or]: [
            {
              userId: context.userId,
              friendId: userId,
            },
            {
              userId,
              friendId: context.userId,
            },
          ],
        },
      });
      const now = new Date();

      if (initialized) friendship.createdAt = now;
      friendship.userId = context.userId;
      friendship.friendId = userId;
      friendship.status = status;
      friendship.source = 'APP';
      friendship.updatedAt = now;

      await friendship.save();
      friendship.sendNotification(userId, status);
      return friendship;
    },
  },
});
