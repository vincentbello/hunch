import gql from 'graphql-tag';
import userFragment from 'graphql/fragments/user';

export default gql`
  ${userFragment}

  query FacebookFriendList {
    fbFriends {
      ...userFields
    }
  }
`;
