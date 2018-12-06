import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import TeamType from './type';

export default models => ({
  removeFavoriteTeam: {
    type: TeamType,
    args: {
      teamId: {
        description: 'Team ID',
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: async function(root, { teamId }, { userId }) {
      await models.FavoriteTeam.destroy({ where: { teamId, userId } });
      return models.Team.findById(teamId, {
        include: {
          model: models.FavoriteTeam,
          where: { teamId, userId },
          required: false,
        },
      });
    },
  },

  setFavoriteTeam: {
    type: TeamType,
    args: {
      teamId: {
        description: 'Team ID',
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: async function(root, { teamId }, { userId }) {
      await models.FavoriteTeam.create({ teamId, userId });
      return models.Team.findById(teamId, {
        include: {
          model: models.FavoriteTeam,
          where: { teamId, userId },
          required: false,
        },
      });
    },
  },
});
