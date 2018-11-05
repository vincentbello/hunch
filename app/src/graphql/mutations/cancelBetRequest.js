import gql from 'graphql-tag';

export default gql`
  mutation CancelBetRequest($id: Int!) {
    cancelBetRequest(id: $id)
  }
`;
