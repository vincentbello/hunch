import gql from 'graphql-tag';
import betFragment from 'graphql/fragments/bet';

export default gql`
  ${betFragment}

  query BetLists($betListType: BetListType) {
    bets(betListType: $betListType) {
      ...betFields
    }
  }
`;
