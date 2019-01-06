import gql from 'graphql-tag';
import hunchFragment from 'graphql/fragments/hunch';

export default gql`
  ${hunchFragment}

  query HunchLists($hunchListType: HunchListType) {
    hunches(hunchListType: $hunchListType) {
      ...hunchFields
    }
  }
`;
