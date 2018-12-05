import { GraphQLEnumType, GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';
import models from '../';

export const LeagueType = new GraphQLEnumType({
  name: 'LeagueType',
  description: 'League',
  values: {
    NBA: { description: 'National Basketball Association' },
  },
});

export default new GraphQLObjectType({
  name: 'Team',
  description: 'A sports team',
  fields: {
    ...attributeFields(models.Team),
    league: {
      type: LeagueType,
      description: 'League this team belongs in',
    },
  },
});
