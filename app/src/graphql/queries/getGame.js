import gql from 'graphql-tag';
import gameFragment from 'graphql/fragments/game';

export default gql`
  ${gameFragment}

  query Game($id: Int!) {
    game(id: $id) {
      ...gameFields
    }
  }
`;
