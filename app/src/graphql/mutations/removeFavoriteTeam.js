import gql from 'graphql-tag';
import teamFragment from 'graphql/fragments/team';

export default gql`
  ${teamFragment}

  mutation RemoveFavoriteTeam($teamId: Int!, $userId: Int) {
    removeFavoriteTeam(teamId: $teamId, userId: $userId) {
      ...teamFields
      isFavorite
    }
  }
`;
