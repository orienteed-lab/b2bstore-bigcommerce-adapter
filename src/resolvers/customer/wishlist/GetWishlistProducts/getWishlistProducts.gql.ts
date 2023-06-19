import { gql } from '@apollo/client';

export const GET_WISHLIST_PRODUCTS = gql`
    query getProductsWishlist($id: [Int!]) {
        customer {
            wishlists(filters: { entityIds: $id }) {
                edges {
                    node {
                        entityId
                        items {
                            edges {
                                node {
                                    product {
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
                                        variants {
                                            edges {
                                                node {
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
    }
`;

export const GET_PRODUCTS_VARIANTS = gql`
    query getProductsVariants($productIds: [Int!], $variantIds: [Int!]) {
        site {
            products(entityIds: $productIds) {
                edges {
                    node {
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
                        path
                    }
                }
            }
        }
    }
`;
export default {
    getWishlistProductsQuery: GET_WISHLIST_PRODUCTS,
    getProductsVariantsQuery: GET_PRODUCTS_VARIANTS
};
