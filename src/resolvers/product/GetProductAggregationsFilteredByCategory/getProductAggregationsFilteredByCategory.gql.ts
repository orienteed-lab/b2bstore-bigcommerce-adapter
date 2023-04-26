import { gql } from '@apollo/client';

export const GET_PRODUCT_AGGREGATIONS_FILTERED_BY_CATEGORY = gql`
    query getProductAggregationsFilteredByCategoryQuery($category: SearchProductsFiltersInput!) {
        site {
            search {
                searchProducts(filters: $category) {
                    filters {
                        edges {
                            node {
                                name
                                __typename
                                ... on ProductAttributeSearchFilter {
                                    attributes {
                                        edges {
                                            node {
                                                __typename
                                                value
                                            }
                                        }
                                    }
                                }
                                ... on CategorySearchFilter {
                                    categories {
                                        edges {
                                            node {
                                                __typename
                                                name
                                                entityId
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export default {
    getProductAggregationsFilteredByCategoryQuery: GET_PRODUCT_AGGREGATIONS_FILTERED_BY_CATEGORY
};
