import gql from 'graphql-tag';

export default gql`
  fragment friendshipFields on Friendship {
    id
    userId
    friendId
    status
    source
  }
`;
