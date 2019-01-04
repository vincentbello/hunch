import gql from 'graphql-tag';
import hunchFragment from 'graphql/fragments/hunch';

export default gql`
  ${hunchFragment}

  query Hunch($hunchId: Int!) {
    hunch(id: $hunchId) {
      ...hunchFields
    }
  }
`;
