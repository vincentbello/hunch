import gql from 'graphql-tag';
import teamFragment from 'graphql/fragments/team';

export default gql`
  ${teamFragment}

  fragment gameFields on Game {
    id
    league
    seasonType
    completed
    inProgress
    homeScore
    awayScore
    startDate
    awayTeam {
      ...teamFields
      isFavorite
    }
    homeTeam {
      ...teamFields
      site
      city
      state
      isFavorite
    }
  }
`;
