import gql from 'graphql-tag';
import userFragment from 'graphql/fragments/user';

export default gql`
  ${userFragment}

  query UserLists($userListType: UserListType) {
    users(userListType: $userListType) {
      ...userFields
    }
  }
`;