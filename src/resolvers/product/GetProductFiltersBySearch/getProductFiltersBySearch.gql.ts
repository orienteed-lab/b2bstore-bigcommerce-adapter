import { gql } from '@apollo/client';

export const GET_PRODUCT_FILTERS_BY_SEARCH = gql`
    query getProductFiltersBySearch($search: SearchProductsFiltersInput!) {
        site {
            search {
                searchProducts(filters: $search) {
                    filters {
                        edges {
                            node {
                                name
                                ... on BrandSearchFilter {
                                    __typename
                                    name
                                    brands {
                                        edges {
                                            node {
                                                name
                                                entityId
                                            }
                                        }
                                    }
                                }
                                ... on CategorySearchFilter {
                                    __typename
                                    name
                                    categories {
                                        edges {
                                            node {
                                                name
                                                entityId
                                            }
                                        }
                                    }
                                }
                                ... on ProductAttributeSearchFilter {
                                    __typename
                                    name
                                    attributes {
                                        edges {
                                            node {
                                                value
                                            }
                                        }
                                    }
                                }
                                ... on OtherSearchFilter {
                                    __typename
                                    name
                                }
                                ... on PriceSearchFilter {
                                    __typename
                                    name
                                }
                                ... on RatingSearchFilter {
                                    __typename
                                    name
                                    ratings {
                                        edges {
                                            node {
                                                value
                                            }
                                        }
                                    }
                                }
                                ... on SearchProductFilter {
                                    __typename
                                    name
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
    getProductFiltersBySearchQuery: GET_PRODUCT_FILTERS_BY_SEARCH
};
