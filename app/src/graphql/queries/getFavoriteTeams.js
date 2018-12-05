import gql from 'graphql-tag';
import teamFragment from 'graphql/fragments/team';

export default gql`
  ${teamFragment}

  query GetFavoriteTeams($userId: Int) {
    favoriteTeams(userId: $userId) {
      ...teamFields
    }
  }
`;
