import gql from 'graphql-tag';
import userFragment from 'graphql/fragments/user';

export default gql`
  ${userFragment}

  query CurrentUser($refreshToken: String!) {
    currentUser(refreshToken: $refreshToken) {
      ...userFields
      accessToken
      refreshToken
    }
  }
`;
