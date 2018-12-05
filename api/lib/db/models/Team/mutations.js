import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import TeamType from './type';

export default models => ({
  removeFavorite: {
    type: TeamType,
    args: {
      entity: {
        description: 'Entity type',
        type: new GraphQLNonNull(GraphQLString),
      },
      entityId: {
        description: 'Entity ID',
        type: new GraphQLNonNull(GraphQLInt),
      },
      userId: {
        description: 'User ID to remove favorite from',
        type: GraphQLInt,
      },
    },
    resolve: async function(root, { entity, entityId, userId: argUserId }, { userId: myId }) {
      const userId = argUserId || myId;
      await models.Favorite.destroy({ where: { entity, entityId, userId } });
      return models.Team.findById(entityId, {
        include: {
          model: models.Favorite,
          as: 'Favorites',
          where: { entity, userId },
          required: false,
        },
      });
    },
  },

  setFavorite: {
    type: TeamType,
    args: {
      entity: {
        description: 'Entity type',
        type: new GraphQLNonNull(GraphQLString),
      },
      entityId: {
        description: 'Entity ID',
        type: new GraphQLNonNull(GraphQLInt),
      },
      userId: {
        description: 'User ID to remove favorite from',
        type: GraphQLInt,
      },
    },
    resolve: async function(root, { entity, entityId, userId: argUserId }, { userId: myId }) {
      const userId = argUserId || myId;
      await models.Favorite.create({ entity, entityId, userId });
      return models.Team.findById(entityId, {
        include: {
          model: models.Favorite,
          as: 'Favorites',
          where: { entity, userId },
          required: false,
        },
      });
    },
  },
});
