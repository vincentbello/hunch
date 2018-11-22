import gql from 'graphql-tag';

export default gql`
  query UserStats($userId: Int!) {
    userStats(userId: $userId) {
      betsWon
      betsPlayed
    }
  }
`;
