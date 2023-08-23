import { GetImageBySkuQuery } from '@schema';

export const getImageBySkuParser = (data: any): GetImageBySkuQuery => {
    return {
        products: {
            items: [
                {
                    __typename: 'SimpleProduct',
                    uid: data.site.product.id,
                    image: {
                        url: data.site.product.defaultImage.urlOriginal
                    }
    
                }
            ]
        }
    };
};
