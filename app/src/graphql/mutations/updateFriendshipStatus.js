import gql from 'graphql-tag';
import friendshipFragment from 'graphql/fragments/friendship';

export default gql`
  ${friendshipFragment}

  mutation UpdateFriendshipStatus($userId: Int!, $status: FriendshipStatusType!) {
    updateFriendshipStatus(userId: $userId, status: $status) {
      ...friendshipFields
    }
  }
`;
