import { gql } from '@apollo/client';

export const GET_PRODUCTS_FOR_PAGEBUILDER_BY_URL_KEY = gql`
    query getProductsForPagebuilderByUrlKey($urlPath: String!) {
        site {
            route(path: $urlPath) {
                node {
                    __typename
                    ... on Product {
                        id
                        entityId
                        name
                        path
                        categories {
                            edges {
                                node {
                                    entityId
                                    name
                                }
                            }
                        }
                        productOptions {
                            edges {
                                node {
                                    displayName
                                    ... on MultipleChoiceOption {
                                        isVariantOption
                                        values {
                                            edges {
                                                node {
                                                    label
                                                    entityId
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        prices {
                            price {
                                currencyCode
                                value
                            }
                            priceRange {
                                max {
                                    currencyCode
                                    value
                                }
                                min {
                                    currencyCode
                                    value
                                }
                            }
                        }
                        sku
                        images {
                            edges {
                                node {
                                    url(width: 320)
                                }
                            }
                        }
                        inventory {
                            isInStock
                        }
                    }
                }
            }
        }
    }
`;

export const GET_CATEGORY_FILTERS = gql`
    query getCategoryFilters($categoryEntityId: Int) {
        site {
            search {
                searchProducts(filters: { categoryEntityIds: $categoryEntityIds }) {
                    products {
                        collectionInfo {
                            totalItems
                        }
                    }
                    filters {
                        edges {
                            node {
                                name
                                ... on CategorySearchFilter {
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
                                    attributes {
                                        edges {
                                            node {
                                                value
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
    getProductsForPagebuilderByUrlKey: GET_PRODUCTS_FOR_PAGEBUILDER_BY_URL_KEY,
    getCategoryFilters: GET_CATEGORY_FILTERS
};
