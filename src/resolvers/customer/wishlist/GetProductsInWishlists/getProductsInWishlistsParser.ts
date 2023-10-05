import { GetProductsInWishlistsQuery } from '@schema';

export const getProductsInWishlistsParser = (data: any): GetProductsInWishlistsQuery => {
    const getProducts = () => {
        const skus = [];

        data.customer.wishlists.edges.map((wishlist: any) =>
            wishlist.node.items.edges.map((item: any) => skus.push(item.node.product.sku))
        );

        const uniqueSkus = skus.filter(function (e, index, array) {
            return array.indexOf(e) === index;
        });

        return uniqueSkus;
    };

    return {
        __typename: 'Query',
        customerWishlistProducts: getProducts()
    };
};
