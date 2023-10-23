import { gql } from '@apollo/client';

export const GET_CATEGORY = gql`
    query getCategory($id: Int!, $filters: SearchProductsFiltersInput!, $sort: SearchProductsSortInput) {
        site {
            categoryTree(rootEntityId: $id) {
                entityId
                name
                description
            }
            search {
                searchProducts(filters: $filters, sort: $sort) {
                    products(first:50) { 
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
                                inventory {
                                    isInStock
                                }
                                reviewSummary {
                                    summationOfRatings
                                }
                                categories {
                                    edges {
                                        node {
                                            name
                                        }
                                    }
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
                                            ... on MultipleChoiceOption {
                                                values {
                                                    edges {
                                                        node {
                                                            label
                                                            entityId
                                                            isDefault
                                                        }
                                                    }
                                                }
                                            }
                                            ... on CheckboxOption {
                                                label
                                            }
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
                                            productOptions {
                                                edges {
                                                    node {
                                                        displayName
                                                        entityId
                                                    }
                                                }
                                            }
                                            prices {
                                                price {
                                                    currencyCode
                                                    value
                                                }
                                                priceRange {
                                                    min {
                                                        currencyCode
                                                        value
                                                    }
                                                }
                                            }
                                            upc
                                        }
                                    }
                                }
                                prices {
                                    price {
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
                                images {
                                    edges {
                                        node {
                                            url(width: 320)
                                        }
                                    }
                                }
                                reviewSummary {
                                    summationOfRatings
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
    getCategoryQuery: GET_CATEGORY
};
