import { GetProductsInWishlistsQuery } from '@schema';

export const getProductsInWishlistsParser = (data: any): GetProductsInWishlistsQuery => {
    
    return {   
        __typename: 'Query',
       customerWishlistProducts:  data.customer.wishlists.edges.map((wishlist: any) => wishlist.node.items.edges.map((item: any) => ({
            sku: item.node.product.sku,
    })))
   };

};
