import gql from 'graphql-tag';
import userFragment from './user';

export default gql`
  ${userFragment}

  fragment betFields on Bet {
    id
    type
    amount
    wager
    responded
    accepted
    active
    winnerId
    resolvedAt
    createdAt
    lastRemindedAt
    game {
      id
      league
    }
    bettor {
      ...userFields
    }
    bettee {
      ...userFields
    }
  }
`;
