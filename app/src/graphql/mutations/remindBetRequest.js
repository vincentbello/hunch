import gql from 'graphql-tag';

export default gql`
  mutation RemindBetRequest($id: Int!) {
    remindBetRequest(id: $id) {
      id
      lastRemindedAt
    }
  }
`;
