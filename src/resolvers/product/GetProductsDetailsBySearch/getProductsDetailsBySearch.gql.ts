import { gql } from '@apollo/client';

export const GET_PRODUCTS_DETAILS_BY_SEARCH = gql`
    query getProductDetailsBySearch($filters: SearchProductsFiltersInput!, $sort: SearchProductsSortInput) {
        site {
            search {
                searchProducts(filters: $filters, sort: $sort) {
                    products {
                        collectionInfo {
                            totalItems
                        }
                        edges {
                            node {
                                id
                                entityId
                                name
                                sku
                                description
                                categories{
                                    edges{
                                        node{
                                            name
                                        }
                                    }
                                }
                                inventory {
                                    isInStock
                                }
                                reviewSummary {
                                    summationOfRatings
                                }
                                type
                                path
                                productOptions {
                                    edges {
                                        node {
                                            __typename
                                            displayName
                                            entityId
                                            isRequired
                                            isVariantOption
                                        }
                                    }
                                }
                                variants {
                                    edges {
                                        node {
                                            sku
                                            entityId
                                            inventory {
                                                isInStock
                                            }
                                            upc
                                            options {
                                                edges {
                                                    node {
                                                        displayName
                                                        entityId
                                                        values {
                                                            edges {
                                                                node {
                                                                    entityId
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
                                                priceRange{
                                                    min{
                                                        currencyCode
                                                        value
                                                    }
                                                    max{
                                                        currencyCode
                                                        value
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                defaultImage{
                                    urlOriginal
                                }
                                customFields {
                                    edges {
                                        node {
                                            name
                                            value
                                        }
                                    }
                                }
                                prices {
                                    basePrice {
                                        currencyCode
                                        value
                                    }
                                    priceRange {
                                        min {
                                            currencyCode
                                            value
                                        }
                                        max {
                                            currencyCode
                                            value
                                        }
                                    }
                                }
                                defaultImage {
                                    url(width: 320)
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
    getProductsDetailsBySearchQuery: GET_PRODUCTS_DETAILS_BY_SEARCH
};
