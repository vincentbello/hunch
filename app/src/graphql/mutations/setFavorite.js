import gql from 'graphql-tag';
import teamFragment from 'graphql/fragments/team';

export default gql`
  ${teamFragment}

  mutation SetFavorite($entity: String!, $entityId: Int!, $userId: Int) {
    setFavorite(entity: $entity, entityId: $entityId, userId: $userId) {
      ...teamFields
      favorite
    }
  }
`;
