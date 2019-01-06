import { GraphQLEnumType, GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';
import GameType from '../Game/type';
import UserType from '../User/type';
import models from '../';

export const HunchListType = new GraphQLEnumType({
  name: 'HunchListType',
  description: 'Types of hunch lists',
  values: {
    ACTIVE: { description: 'Active Hunches' },
    COMPLETED: { description: 'Completed Hunches' },
    PENDING: { description: 'Pending Hunches' },
    REQUESTED: { description: 'Requested Hunches' },
  },
});

export default new GraphQLObjectType({
  name: 'Hunch',
  description: 'A hunch challenge',
  fields: {
    ...attributeFields(models.Hunch),
    game: {
      type: GameType,
      description: 'The game this hunch is about',
    },
    bettor: {
      type: UserType,
      description: 'The user who requested the hunch',
    },
    bettee: {
      type: UserType,
      description: 'The user who was requested for the hunch',
    },
  },
});
