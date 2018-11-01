import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { endOfDay, max, startOfDay } from 'date-fns';
import { resolver } from 'graphql-sequelize';
import GameType from './type';

export default models => ({
  upcomingGames: {
    type: new GraphQLList(GameType),
    args: {
      date: {
        description: 'Day to fetch games for, in MMDDYYYY format',
        type: GraphQLNonNull(GraphQLString),
      },
      league: {
        description: 'League to fetch games for',
        type: GraphQLNonNull(GraphQLString),
      },
    },
    resolve: resolver(models.Game, {
      before: (findOptions, { date, league }) => {
        const dateObj = new Date(date.substr(4), parseInt(date.substr(0, 2), 10) - 1, date.substr(2, 2));
        return {
          ...findOptions,
          where: {
            startDate: {
              [Op.gte]: max(startOfDay(dateObj), new Date()),
              [Op.lte]: endOfDay(dateObj),
            },
            league,
          },
          order: [['startDate', 'ASC']],
          include: [
            { model: models.Team, as: 'homeTeam' },
            { model: models.Team, as: 'awayTeam' },
          ],
        };
      },
    }),
  },
});
