import { CreateWishlistMutation } from '@schema';

export const createWishlistParser = (data: any): CreateWishlistMutation => {
    
    return {
        createWishlist: {
            wishlist:{
                id: data.wishlist.createWishlist.result.entityId
            } 
        }
    };
};
