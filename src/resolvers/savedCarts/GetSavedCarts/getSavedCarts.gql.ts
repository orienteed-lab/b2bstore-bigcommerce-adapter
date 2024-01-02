import { gql } from '@apollo/client';

export const GET_USER_EMAIL = gql`
    query getUserEmail {
        customer {
            email
        }
    }
`;

export const GET_PRODUCT_AND_VARIANT = gql`
    query getProductAndVariant($productIds: [Int!], $variantIds: [Int!]) {
        site {
            products(entityIds: $productIds) {
                edges {
                    node {
                        entityId
                        name
                        images {
                            edges {
                                node {
                                    urlOriginal
                                }
                            }
                        }
                        sku
                        prices {
                            price {
                                currencyCode
                                value
                            }
                            basePrice {
                                currencyCode
                                value
                            }
                        }
                        productOptions {
                            edges {
                                node {
                                    entityId
                                }
                            }
                        }
                        variants(entityIds: $variantIds) {
                            edges {
                                node {
                                    entityId
                                    defaultImage {
                                        urlOriginal
                                    }
                                    sku
                                    prices {
                                        price {
                                            currencyCode
                                            value
                                        }
                                        basePrice {
                                            currencyCode
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
`;

export default {
    getUserEmailQuery: GET_USER_EMAIL,
    getProductAndVariantQuery: GET_PRODUCT_AND_VARIANT
};
