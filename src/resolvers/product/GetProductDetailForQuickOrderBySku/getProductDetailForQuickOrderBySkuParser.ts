import { GetProductDetailForQuickOrderBySkuQuery } from '@schema';

export const getProductDetailForQuickOrderBySkuParser = (data: any): GetProductDetailForQuickOrderBySkuQuery => {
    return {
        products: {
            total_count: data.site.search.searchProducts.products.collectionInfo.totalItems,
            items: data.site.search.searchProducts.products.edges.map((item) => ({
                orParentSku: "",
                id: item.node.entityId,
                uid: item.node.id,
                name: item.node.name,
                sku: item.node.sku,
                price: {
                    minimalPrice: {
                        amount: {
                            value: item.node.prices.priceRange.min.value,
                            currency: item.node.prices.priceRange.min.currencyCode
                        }
                    },
                    regularPrice: {
                        amount: {
                            value: item.node.prices.price.value,
                            currency: item.node.prices.price.currencyCode
                        }
                    }
                }
            }))
        }
    }
};
