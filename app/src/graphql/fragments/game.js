import gql from 'graphql-tag';
import teamFragment from 'graphql/fragments/team';

export default gql`
  ${teamFragment}

  fragment gameFields on Game {
    id
    seasonType
    homeScore
    awayScore
    startDate
    awayTeam {
      ...teamFields
    }
    homeTeam {
      ...teamFields
      site
      city
      state
    }
  }
`;