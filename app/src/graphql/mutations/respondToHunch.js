import gql from 'graphql-tag';

export default gql`
  mutation RespondToHunch($id: Int!, $accepted: Boolean!) {
    respondToHunch(id: $id, accepted: $accepted) {
      id
      active
      responded
    }
  }
`;
