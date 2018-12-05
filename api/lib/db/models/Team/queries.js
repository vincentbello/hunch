import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
// import { Op: {iLike} } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import TeamType, { LeagueType } from './type';

export default models => ({
  team: {
    type: TeamType,
    args: {
      id: {
        description: 'ID of team',
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: resolver(models.Team),
  },

  teams: {
    type: GraphQLList(TeamType),
    args: {
      league: {
        description: 'League to get teams for',
        type: LeagueType,
      },
      userId: {
        description: 'ID of user to identify favorite teams for',
        type: GraphQLInt,
      },
    },
    resolve: resolver(models.Team, {
      before: (findOptions, { league, userId }, { userId: myId }) => ({
        ...findOptions,
        where: {
          league,
        },
        order: [['firstName', 'ASC']],
        include: {
          model: models.FavoriteTeam,
          // as: 'favorite',
          where: {
            userId: userId || myId,
          },
          required: false,
        },
      }),
    }),
  },

  favoriteTeams: {
    type: GraphQLList(TeamType),
    args: {
      userId: {
        description: 'ID of user to get favorite teams for',
        type: GraphQLInt,
      },
    },
    resolve: resolver(models.Team, {
      before: (findOptions, { league, userId }, { userId: myId }) => ({
        ...findOptions,
        order: [['abbreviation', 'ASC']],
        include: {
          model: models.FavoriteTeam,
          where: {
            userId: userId || myId,
          },
        },
      }),
    }),
  },
});
