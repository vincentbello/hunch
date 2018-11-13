import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
// import { Op: {iLike} } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import teamType from './type';

export default models => ({
  team: {
    type: teamType,
    args: {
      id: {
        description: 'ID of team',
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: resolver(models.Team),
  },
});
