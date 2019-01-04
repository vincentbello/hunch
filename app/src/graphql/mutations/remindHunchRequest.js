import gql from 'graphql-tag';

export default gql`
  mutation RemindHunchRequest($id: Int!) {
    remindHunchRequest(id: $id) {
      id
      lastRemindedAt
    }
  }
`;
