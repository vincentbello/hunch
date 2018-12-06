import gql from 'graphql-tag';
import gameFragment from 'graphql/fragments/game';

export default gql`
  ${gameFragment}

  query UpcomingGames($date: String!, $league: LeagueType!) {
    upcomingGames(date: $date, league: $league) {
      ...gameFields
    }
  }
`;
