import { gql } from '@apollo/client';

export const CREATE_WISHLIST = gql`
    mutation ($input :  CreateWishlistInput!){
        wishlist {
            createWishlist (input: $input){
                result {
                    __typename
                    entityId
                }
            }
        }
    }
`;

export default {
    createWishlistMutation: CREATE_WISHLIST
};
