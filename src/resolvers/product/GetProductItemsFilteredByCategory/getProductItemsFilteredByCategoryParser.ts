import { GetProductItemsFilteredByCategoryQuery } from '@schema';

export const getProductItemsFilteredByCategoryParser = (data: any): GetProductItemsFilteredByCategoryQuery => {
   return{
    products:  {
        items: data.site.category.products.edges.map((item: any) => ({
            __typename: item.node.variants.edges.length !== 0 ? 'ConfigurableProduct' : 'SimpleProduct',
            id: item.node.entityId,
            uid: item.node.id,
            name: item.node.name,
            sku: item.node.sku,
            url_key: item.node.path.slice(1, -1),
            url_suffix: '.html'
        }))
    }
};
};
