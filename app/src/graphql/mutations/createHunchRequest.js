import gql from 'graphql-tag';
import hunchFragment from 'graphql/fragments/hunch';

export default gql`
  ${hunchFragment}

  mutation CreateHunchRequest($amount: Int!, $betteeId: Int!, $bettorPickTeamId: Int!, $gameId: Int!, $type: String!, $wager: String) {
    createHunchRequest(amount: $amount, betteeId: $betteeId, bettorPickTeamId: $bettorPickTeamId, gameId: $gameId, type: $type, wager: $wager) {
      ...hunchFields
    }
  }
`;
