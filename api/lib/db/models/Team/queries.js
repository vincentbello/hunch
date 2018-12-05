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
        description: 'ID for user to get favorites for',
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
          model: models.Favorite,
          as: 'Favorites',
          where: {
            entity: 'Team',
            userId: userId || myId,
          },
          required: false,
        },
      }),
    }),
  },
});
