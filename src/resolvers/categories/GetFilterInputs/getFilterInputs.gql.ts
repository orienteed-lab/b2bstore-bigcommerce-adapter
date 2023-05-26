import { gql } from '@apollo/client';

export const GET_FILTER_INPUTS = gql`
    query getFilterInputs {
  site {
    search {
      searchProducts(filters:{searchTerm:""}) {
        filters {
          edges {
            node {
              name
              __typename
            }
          }
        }
      }
    }
  }
}
`;

export default {
    getFilterInputsQuery: GET_FILTER_INPUTS
};
