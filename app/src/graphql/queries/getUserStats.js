import gql from 'graphql-tag';

export default gql`
  query FullUserStats($userId: Int!) {
    userStats(userId: $userId) {
      won
      played
      amountWon
      amountLost
    }
  }
`;
