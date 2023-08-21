import { gql } from '@apollo/client';

export const UPDATE_WISHLIST = gql`
    mutation updateWishlist($wishlist:UpdateWishlistInput!) {
    wishlist {
        updateWishlist(input:$wishlist) {
            result {
                entityId
                name
                isPublic
            }
        }
    }
}
`;

export default {
    updateWishlistMutation: UPDATE_WISHLIST
};
