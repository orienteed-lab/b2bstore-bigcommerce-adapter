import { gql } from '@apollo/client';

export const GET_PRODUCT_DETAIL_FOR_CONFIGURABLE_OPTIONS_BY_SKU = gql`
    query getProductDetailForConfigurableOptionsBySku($sku: String) {
        site {
            product(sku: $sku) {
                id
                entityId
                name
                sku
                description
                plainTextDescription
                categories {
                    edges {
                        node {
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
                            isPurchasable
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
                        }
                    }
                }
                defaultImage {
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
            }
        }
    }
`;

export default {
    getProductDetailForConfigurableOptionsBySkuQuery: GET_PRODUCT_DETAIL_FOR_CONFIGURABLE_OPTIONS_BY_SKU
};
