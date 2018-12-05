import { GraphQLEnumType, GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';
import TeamType from '../Team/type';
import UserType from '../User/type';
import models from '../';

export default new GraphQLObjectType({
  name: 'FavoriteTeam',
  description: 'The record of a favorite team',
  fields: {
    ...attributeFields(models.FavoriteTeam),
    team: {
      type: TeamType,
      description: 'The team in question',
    },
    user: {
      type: UserType,
      description: 'The user who favorited this team',
    },
  },
});
