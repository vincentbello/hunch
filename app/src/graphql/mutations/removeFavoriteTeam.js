import gql from 'graphql-tag';
import teamFragment from 'graphql/fragments/team';

export default gql`
  ${teamFragment}

  mutation RemoveFavoriteTeam($teamId: Int!) {
    removeFavoriteTeam(teamId: $teamId) {
      ...teamFields
      isFavorite
    }
  }
`;
