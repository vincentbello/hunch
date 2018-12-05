import { GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';
import TeamType, { LeagueType } from '../Team/type';
import models from '../';

export default new GraphQLObjectType({
  name: 'Game',
  description: 'A sports game',
  fields: {
    ...attributeFields(models.Game),
    league: {
      type: LeagueType,
      description: 'League this game was played in',
    },
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
