import { gql } from '@apollo/client';

export const GET_AUTOCOMPLETE_RESULTS = gql`
    query getAutocompleteResults($search: SearchProductsFiltersInput!) {
        site {
            search {
                searchProducts(filters: $search) {
                    products {
                        collectionInfo {
                            totalItems
                        }
                        edges {
                            node {
                                categories {
                                    edges {
                                        node {
                                            name
                                            id
                                            entityId
                                        }
                                    }
                                }
                                prices {
                                    priceRange {
                                        max {
                                            value
                                            currencyCode
                                        }
                                        min {
                                            value
                                            currencyCode
                                        }
                                    }
                                    price {
                                        value
                                        currencyCode
                                    }
                                }
                                productOptions {
                                    edges {
                                        node {
                                            __typename
                                            displayName
                                            entityId
                                        }
                                    }
                                }
                                inventory {
                                    isInStock
                                }
                                entityId
                                id
                                name
                                sku
                                path
                                defaultImage {
                                    url(width: 320)
                                }
                            }
                        }
                    }
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
    getAutocompleteResultsQuery: GET_AUTOCOMPLETE_RESULTS
};
