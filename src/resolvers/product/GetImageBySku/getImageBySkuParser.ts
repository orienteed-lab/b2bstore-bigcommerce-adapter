import { GetImageBySkuQuery } from '@schema';

export const getImageBySkuParser = (data: any, prodSku: any): GetImageBySkuQuery => {
    return {
        products: {
            items: data.site.product.sku === prodSku ? [
                {
                    __typename: 'SimpleProduct',
                    uid: data.site.product.id,
                    image: {
                        url: data.site.product.defaultImage.urlOriginal
                    }
    
                }
            ] : [
                {
                    __typename: 'SimpleProduct',
                    uid: data.site.product.variants.edges.find(variant => variant.node.sku === prodSku)?.node?.id,
                    image: {
                        url: data.site.product.variants.edges.find(variant => variant.node.sku === prodSku)?.node?.defaultImage?.urlOriginal
                    }
    
                }
            ]
        }
    };
};
