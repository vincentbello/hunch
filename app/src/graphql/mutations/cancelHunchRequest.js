import gql from 'graphql-tag';

export default gql`
  mutation CancelHunchRequest($id: Int!) {
    cancelHunchRequest(id: $id)
  }
`;
