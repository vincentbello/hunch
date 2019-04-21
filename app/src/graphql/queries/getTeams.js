import gql from 'graphql-tag';
import teamFragment from 'graphql/fragments/team';

export default gql`
  ${teamFragment}

  query GetTeams($league: LeagueType, $userId: Int) {
    teams(league: $league, userId: $userId) {
      ...teamFields
      isFavorite
    }
  }
`;
