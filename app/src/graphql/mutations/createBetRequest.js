import gql from 'graphql-tag';
import betFragment from 'graphql/fragments/bet';

export default gql`
  ${betFragment}

  mutation CreateBetRequest($amount: Int!, $betteeId: Int!, $bettorPickTeamId: Int!, $gameId: Int!, $type: String!, $wager: String) {
    createBetRequest(amount: $amount, betteeId: $betteeId, bettorPickTeamId: $bettorPickTeamId, gameId: $gameId, type: $type, wager: $wager) {
      ...betFields
    }
  }
`;
