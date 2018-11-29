import gql from 'graphql-tag';

export default gql`
  fragment userFields on User {
    id
    firstName
    lastName
    fullName
    imageUrl
    gender
    fbId
    lastLoginAt
    createdAt
  }
`;
