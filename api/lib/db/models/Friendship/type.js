import { GraphQLEnumType, GraphQLInt, GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';
import { Op } from 'sequelize';
import UserType from '../User/type';
import models from '../';

export const FriendshipStatusType = new GraphQLEnumType({
  name: 'FriendshipStatusType',
  description: 'Types of friendships',
  values: {
    ACTIVE: { description: 'Active friendship' },
    PENDING: { description: 'Waiting on requested user to respond to friend request' },
    REJECTED: { description: 'Rejected friendship' },
    DELETED: { description: 'Deleted friendship, either via unfriending or canceling a friendship request' },
  },
});

export default new GraphQLObjectType({
  name: 'Friendship',
  description: 'A friendship between two Hunch users',
  fields: {
    ...attributeFields(models.Friendship),
    status: {
      type: FriendshipStatusType,
      description: 'Status of friendship',
    },
    user: {
      type: UserType,
      description: 'The user who initiated the friendship',
    },
    friend: {
      type: UserType,
      description: 'The user who is the target of the friendship',
    },
  },
});
