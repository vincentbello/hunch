import gql from 'graphql-tag';
import betFragment from 'graphql/fragments/bet';

export default gql`
  ${betFragment}

  query Bet($betId: Int!) {
    bet(id: $betId) {
      ...betFields
    }
  }
`;
