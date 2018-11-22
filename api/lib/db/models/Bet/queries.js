import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import BetType, { BetListType } from './type';

export default models => ({
  bet: {
    type: BetType,
    args: {
      id: {
        description: 'ID of bet',
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: resolver(models.Bet, {
      before: findOptions => ({
        ...findOptions,
        include: [
          { model: models.Game, as: 'game' },
          { model: models.User, as: 'bettor' },
          { model: models.User, as: 'bettee' },
        ],
      }),
    }),
  },

  bets: {
    type: new GraphQLList(BetType),
    args: {
      betListType: {
        description: 'Bet list type',
        type: BetListType,
      },
    },
    resolve: resolver(models.Bet, {
      before: (findOptions, args, context) => ({
        ...findOptions,
        include: [
          { model: models.Game, as: 'game', where: args.betListType === 'REQUESTED' ? { startDate: { [Op.gt]: new Date() } } : {} },
          { model: models.User, as: 'bettor' },
          { model: models.User, as: 'bettee' },
        ],
        where: {
          ACTIVE: {
            active: true,
            [Op.or]: [
              { bettorId: context.userId },
              { betteeId: context.userId },
            ],
          },
          COMPLETED: {
            accepted: true,
            active: false,
            [Op.or]: [
              { bettorId: context.userId },
              { betteeId: context.userId },
            ],
          },
          PENDING: {
            bettorId: context.userId,
            responded: false,
          },
          REQUESTED: {
            betteeId: context.userId,
            responded: false,
          },
        }[args.betListType] || {},
      }),
    }),
  },
});
