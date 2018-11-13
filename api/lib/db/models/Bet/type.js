import { GraphQLEnumType, GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';
import GameType from '../Game/type';
import UserType from '../User/type';
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
});

export default new GraphQLObjectType({
  name: 'Bet',
  description: 'A Hunch bet',
  fields: {
    ...attributeFields(models.Bet),
    game: {
      type: GameType,
      description: 'The game this bet is about',
    },
    bettor: {
      type: UserType,
      description: 'The user who requested the bet',
    },
    bettee: {
      type: UserType,
      description: 'The user who was requested for the bet',
    },
  },
});
