import gql from 'graphql-tag';

export default gql`
  fragment teamFields on Team {
    id
    firstName
    lastName
    fullName
    abbreviation
    imageUrl
    conference
    division
  }
`;
