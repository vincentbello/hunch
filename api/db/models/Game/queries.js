import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
// import { Op: {iLike} } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import gameType from './type';

export default models => ({
  // team: {
  //   type: teamType,
  //   args: {
  //     id: {
  //       description: 'ID of team',
  //       type: new GraphQLNonNull(GraphQLString),
  //     },
  //   },
  //   resolve: resolver(models.Team, {
  //     after: result => result.length ? result[0] : result
  //   }),
  // },
  // wallets: {
  //   type: new GraphQLList(walletType),
  //   resolve: resolver(Wallet)
  // },
  // walletSearch: {
  //   type: new GraphQLList(walletType),
  //   args: {
  //     query: {
  //       description: 'Fuzzy-matched name of wallet',
  //       type: new GraphQLNonNull(GraphQLString)
  //     }
  //   },
  //   resolve: resolver(Wallet, {
  //     dataLoader: false,
  //     before: (findOptions, args) => ({
  //       where: {
  //         name: { [iLike]: `%${args.query}%` },
  //       },
  //       order: [['name', 'ASC']],
  //       ...findOptions
  //     }),
  //     after: sort
  //   })
  // }
});
