import gql from 'graphql-tag';
import teamFragment from 'graphql/fragments/team';

export default gql`
  ${teamFragment}

  mutation SetFavoriteTeam($teamId: Int!, $userId: Int) {
    setFavoriteTeam(teamId: $teamId, userId: $userId) {
      ...teamFields
      isFavorite
    }
  }
`;
