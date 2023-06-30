import { gql } from '@apollo/client';

export const REMOVE_PRODUCTS_FROM_WISHLIST = gql`
    mutation removeProductsFromWishlist($wishlistId: Int!, $wishlistItemsId: [Int!]!) {
        wishlist {
            deleteWishlistItems(input:{entityId:$wishlistId, itemEntityIds:$wishlistItemsId}) {
                result {
                    entityId
                    items {
                        edges {
                            node {
                                productEntityId
                                entityId
                            }
                        }
                    }
                }
            }
        }
    }
`;

export default {
    removeProductsFromWishlistMutation: REMOVE_PRODUCTS_FROM_WISHLIST
};
