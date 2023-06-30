import { gql } from '@apollo/client';

export const GET_PRODUCTS_VARIANTS = gql`
    query getProductsVariants($productIds: [Int!], $variantIds: [Int!]) {
        site {
            products(entityIds: $productIds) {
                edges {
                    node {
                        entityId
                        name
                        sku
                        inventory {
                            isInStock
                        }
                        path
                        images {
                            edges {
                                node {
                                    urlOriginal
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
                        productOptions {
                            edges {
                                node {
                                    displayName
                                    isVariantOption
                                }
                            }
                        }
                        variants(entityIds: $variantIds) {
                            edges {
                                node {
                                    options {
                                        edges {
                                            node {
                                                displayName
                                                entityId
                                                values {
                                                    edges {
                                                        node {
                                                            entityId
                                                            label
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    inventory {
                                        isInStock
                                    }
                                    entityId
                                    id
                                    defaultImage {
                                        urlOriginal
                                    }
                                    productOptions {
                                        edges {
                                            node {
                                                entityId
                                                displayName
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
    getProductsVariantsQuery: GET_PRODUCTS_VARIANTS
};
