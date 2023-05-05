import { GetProductItemsFilteredByCategoryQuery } from '@schema';

export const getProductItemsFilteredByCategoryParser = (data: any): GetProductItemsFilteredByCategoryQuery => {
   return{
    products:  {
        items: data.site.category.products.edges.map((item: any) => ({
            __typename: 'ConfigurableProduct',
            id: item.node.entityId,
            uid: item.node.id,
            name: item.node.name,
            sku: item.node.sku,
            url_key: item.node.path,
            url_suffix: ''
        }))
    }
};
};
