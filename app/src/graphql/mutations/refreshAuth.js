import gql from 'graphql-tag';
import userFragment from 'graphql/fragments/user';

export default gql`
  ${userFragment}

  mutation RefreshAuth($refreshToken: String!) {
    refreshAuth(refreshToken: $refreshToken) {
      ...userFields
      accessToken
      refreshToken
    }
  }
`;
