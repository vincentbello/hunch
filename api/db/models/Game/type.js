import { GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';
import TeamType from '../Team/type';
import models from '../';

export default new GraphQLObjectType({
  name: 'Game',
  description: 'A sports game',
  fields: {
    ...attributeFields(models.Game),
    homeTeam: {
      type: TeamType,
      description: 'The home team',
    },
    awayTeam: {
      type: TeamType,
      description: 'The away team',
    },
  },
});
