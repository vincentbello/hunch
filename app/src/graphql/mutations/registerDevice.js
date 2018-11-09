import gql from 'graphql-tag';

export default gql`
  mutation RegisterDevice($os: DeviceOsType!, $token: String!) {
    registerDevice(os: $os, token: $token)
  }
`;
