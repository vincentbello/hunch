import gql from 'graphql-tag';
import teamFragment from 'graphql/fragments/team';

export default gql`
  ${teamFragment}

  mutation SetFavoriteTeam($teamId: Int!) {
    setFavoriteTeam(teamId: $teamId) {
      ...teamFields
      isFavorite
    }
  }
`;
