import gql from 'graphql-tag';
import userFragment from 'graphql/fragments/user';

export default gql`
  ${userFragment}

  mutation Login($fbAccessToken: String!) {
    login(fbAccessToken: $fbAccessToken) {
      ...userFields
      accessToken
      refreshToken
    }
  }
`;
