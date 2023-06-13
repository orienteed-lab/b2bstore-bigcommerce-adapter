import { GetWishlistsQuery } from '@schema';

export const getWishlistsParser = (data: any): GetWishlistsQuery => {

    return {
        customer: {
            wishlists: data.customer.wishlists.edges.map((wishlist: any)  => ({
                id: wishlist.node.entityId,
                items_count: wishlist.node.items.edges.length, 
                sharing_code: 1, //TODO_B2B: BigCommerce doesn't have an equivalent
                name: wishlist.node.name,
                visibility: wishlist.node.isPublic
            })).filter((option: any) => option !== null)
        }
    };
};
