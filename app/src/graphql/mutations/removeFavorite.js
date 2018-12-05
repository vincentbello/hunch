import gql from 'graphql-tag';
import teamFragment from 'graphql/fragments/team';

export default gql`
  ${teamFragment}

  mutation RemoveFavorite($entity: String!, $entityId: Int!, $userId: Int) {
    removeFavorite(entity: $entity, entityId: $entityId, userId: $userId) {
      ...teamFields
      favorite
    }
  }
`;
