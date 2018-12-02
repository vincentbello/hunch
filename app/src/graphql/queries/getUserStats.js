import gql from 'graphql-tag';

export default gql`
  fragment statFields on StatGroup {
    won
    played
    amountWon
    amountLost
  }

  query FullUserStats($userId: Int!) {
    userStats(userId: $userId) {
      overall {
        ...statFields
      }
      against {
        ...statFields
      }
    }
  }
`;
