import gql from 'graphql-tag';

export default gql`
  query GetUserFriendship($userId: Int!) {
    userFriendship(userId: $userId) {
      userId
      friendId
      status
      source
    }
  }
`;
