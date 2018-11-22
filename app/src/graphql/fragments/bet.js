import gql from 'graphql-tag';
import userFragment from './user';

export default gql`
  ${userFragment}

  fragment betFields on Bet {
    id
    type
    amount
    wager
    bettorPickTeamId
    responded
    accepted
    active
    winnerId
    resolvedAt
    createdAt
    lastRemindedAt
    game {
      id
    }
    bettor {
      ...userFields
    }
    bettee {
      ...userFields
    }
  }
`;
