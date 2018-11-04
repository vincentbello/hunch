import gql from 'graphql-tag';

export default gql`
  fragment userFields on User {
    id
    fullName
    imageUrl
    gender
  }
`;
