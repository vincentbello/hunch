import gql from 'graphql-tag';

export default gql`
  mutation RespondToBet($id: Int!, $accepted: Boolean!) {
    respondToBet(id: $id, accepted: $accepted) {
      id
      active
      responded
    }
  }
`;
