import { GraphQLEnumType, GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';
import models from '../';

export const BetListType = new GraphQLEnumType({
  name: 'BetListType',
  description: 'Types of bet lists',
  values: {
    ACTIVE: { description: 'Active Bets' },
    COMPLETED: { description: 'Completed Bets' },
    PENDING: { description: 'Pending Bets' },
    REQUESTED: { description: 'Requested Bets' },
  },
})

export default new GraphQLObjectType({
  name: 'Bet',
  description: 'A Hunch bet',
  fields: attributeFields(models.Bet),
});
