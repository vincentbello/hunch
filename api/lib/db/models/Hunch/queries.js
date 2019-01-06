import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import HunchType, { HunchListType } from './type';

export default models => ({
  hunch: {
    type: HunchType,
    args: {
      id: {
        description: 'ID of hunch',
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: resolver(models.Hunch, {
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

  hunches: {
    type: new GraphQLList(HunchType),
    args: {
      hunchListType: {
        description: 'Hunch list type',
        type: HunchListType,
      },
    },
    resolve: resolver(models.Hunch, {
      before: (findOptions, args, context) => ({
        ...findOptions,
        include: [
          { model: models.Game, as: 'game', where: ['REQUESTED', 'PENDING'].includes(args.hunchListType) ? { startDate: { [Op.gt]: new Date() } } : {} },
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
        }[args.hunchListType] || {},
      }),
    }),
  },
});
