import { GetParentSkuBySkuQuery } from '@schema';

export const getParentSkuBySkuParser = (data: any): GetParentSkuBySkuQuery => {
    return {
        products: {
            items: [
                {
                    __typename: 'SimpleProduct',
                    orParentSku: data.site.product.sku,
                    uid: data.site.product.id,
    
                }
            ]
        }
    };
};
