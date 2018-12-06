import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import Sequelize, { Op } from 'sequelize';
import { addHours, endOfDay, max, startOfDay } from 'date-fns';
import { resolver } from 'graphql-sequelize';
import { LeagueType } from '../Team/type';
import GameType from './type';

export default models => ({
  game: {
    type: GameType,
    args: {
      id: {
        description: 'ID of game',
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: resolver(models.Game, {
      before: (findOptions, _, { userId }) => ({
        ...findOptions,
        include: [
          {
            model: models.Team,
            as: 'homeTeam',
            include: {
              model: models.FavoriteTeam,
              where: { userId },
              required: false,
            },
          },
          {
            model: models.Team,
            as: 'awayTeam',
            include: {
              model: models.FavoriteTeam,
              where: { userId },
              required: false,
            },
          },
        ],
      }),
    }),
  },

  upcomingGames: {
    type: new GraphQLList(GameType),
    args: {
      date: {
        description: 'Day to fetch games for, in MMDDYYYY format',
        type: GraphQLNonNull(GraphQLString),
      },
      league: {
        description: 'League to fetch games for',
        type: GraphQLNonNull(LeagueType),
      },
    },
    resolve: resolver(models.Game, {
      before: (findOptions, { date, league }, { userId }) => {
        const dateObj = new Date(date.substr(4), parseInt(date.substr(0, 2), 10) - 1, date.substr(2, 2));
        const hourOffset = 7; // TODO: Figure out how to handle this
        return {
          ...findOptions,
          where: {
            startDate: {
              [Op.gte]: max(addHours(startOfDay(dateObj), hourOffset), new Date()),
              [Op.lte]: addHours(endOfDay(dateObj), hourOffset),
            },
            league,
          },
          include: [
            {
              model: models.Team,
              as: 'homeTeam',
              include: {
                model: models.FavoriteTeam,
                where: { userId },
                required: false,
              },
            },
            {
              model: models.Team,
              as: 'awayTeam',
              include: {
                model: models.FavoriteTeam,
                where: { userId },
                required: false,
              },
            },
          ],
          order: [
            Sequelize.literal('`homeTeam->FavoriteTeam`.`id` IS NOT NULL OR `awayTeam->FavoriteTeam`.`id` IS NOT NULL DESC'),
            ['startDate', 'ASC'],
          ],
        };
      },
    }),
  },
});
