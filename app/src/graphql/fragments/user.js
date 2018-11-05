import gql from 'graphql-tag';

export default gql`
  fragment userFields on User {
    id
    firstName
    fullName
    imageUrl
    gender
  }
`;
