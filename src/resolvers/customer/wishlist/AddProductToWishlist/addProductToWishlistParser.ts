import { AddProductToWishlistMutation } from '@schema';

export const addProductToWishlistParser = (data: any): AddProductToWishlistMutation => {
    
    return {
        addProductsToWishlist: {
            user_errors: data
        }
    }

};
