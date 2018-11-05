import gql from 'graphql-tag';

export default gql`
  fragment teamFields on Team {
    id
    firstName
    lastName
    abbreviation
    imageUrl
    conference
    division
  }
`;
