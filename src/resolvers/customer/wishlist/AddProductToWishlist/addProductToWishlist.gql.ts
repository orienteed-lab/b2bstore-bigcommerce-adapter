import { gql } from '@apollo/client';

export const GET_ITEM_ID_BY_SKU = gql`
    query getItemIdBySku($sku: String) {
        site {
            product(sku: $sku) {
                entityId
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
`;

export const GET_WISHLIST_ID = gql`
    query getWishlistId {
        customer {
            wishlists {
                edges {
                    node {
                        entityId
                    }
                }
            }
        }
    }
`;

export const ADD_PRODUCT_TO_WISHLIST = gql`
    mutation AddProductToWishlist($items:AddWishlistItemsInput!) {
        wishlist {
            addWishlistItems(input: $items) {
                result {
                    name
                }
            }
        }
    }
`;

export default {
    getItemIdBySkuQuery: GET_ITEM_ID_BY_SKU,
    addProductToWishlistMutation: ADD_PRODUCT_TO_WISHLIST,
    getWishlistIdQuery: GET_WISHLIST_ID
};
