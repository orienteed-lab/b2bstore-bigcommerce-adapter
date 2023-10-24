import { GetProductDetailForQuickOrderBySkuQuery } from '@schema';

export const getProductDetailForQuickOrderBySkuParser = (data: any, givenSku: any): GetProductDetailForQuickOrderBySkuQuery => {
    const getVariant = () => {
        const variant = data.site.search.searchProducts.products.edges[0].node.variants.edges.find((item) => item.node.sku === givenSku);

        return [
            {
                orParentSku: data.site.search.searchProducts.products.edges[0].node.sku,
                id: variant.node.entityId,
                uid: variant.node.id,
                name: `${data.site.search.searchProducts.products.edges[0].node.name}-${variant.node.sku}`,
                sku: variant.node.sku,
                stock_status: variant.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                price: {
                    minimalPrice: {
                        amount: {
                            value: variant.node.prices.priceRange.min.value,
                            currency: variant.node.prices.priceRange.min.currencyCode
                        }
                    },
                    regularPrice: {
                        amount: {
                            value: variant.node.prices.price.value,
                            currency: variant.node.prices.price.currencyCode
                        }
                    }
                }
            }
        ];
    };

    if (data.site.search.searchProducts.products.edges[0].node.sku === givenSku) {
        return {
            products: {
                total_count: data.site.search.searchProducts.products.collectionInfo.totalItems,
                items: data.site.search.searchProducts.products.edges.map((item) => ({
                    orParentSku: null,
                    id: item.node.entityId,
                    uid: item.node.id,
                    name: item.node.name,
                    sku: item.node.sku,
                    stock_status: item.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
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
        };
    } else {
        return {
            products: {
                total_count: data.site.search.searchProducts.products.collectionInfo.totalItems,
                items: getVariant()
            }
        };
    }
};
