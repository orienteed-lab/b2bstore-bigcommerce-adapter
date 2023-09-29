import { GetSimpleProductQuery } from '@schema';

export function getSimpleProductParser(data: any): GetSimpleProductQuery {
    return {
        products: {
            items: [
                {
                    __typename: 'SimpleProduct',
                    name: data.site.product.name,
                    sku: data.site.product.sku,
                    orParentSku: data.site.product.sku,
                    uid: data.site.product.id,
                    id: data.site.product.id,
                    // @ts-ignore // Ignore stock_status type error because we cannot import ProductStockStatus enum from the schema
                    stock_status: data.site.product.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                    media_gallery_entries: data.site.product.images.edges.length !== 0 ? data.site.product.images.edges.map((image: any) => ({
                        file: image.node.urlOriginal
                    })): [{file: ''}],
                    categories: data.site.product.categories.edges.map((category: any) => ({
                        uid: category.node.entityId,
                        breadcrumbs: {
                            category_uid: category.node.entityId
                        }
                    })),
                    description: {
                        html: data.site.product.description
                    },
                    image: {
                        label: data.site.product.images.edges.length !== 0 ? data.site.product.images.edges[0].node.altText : '',
                        url: data.site.product.images.edges.length !== 0 ? data.site.product.images.edges[0].node.urlOriginal: ''
                    },
                    price: {
                        regularPrice: {
                            amount: {
                                currency: data.site.product.prices.price.currencyCode,
                                value: data.site.product.prices.price.value
                            }
                        },
                        minimalPrice: {
                            amount: {
                                currency: data.site.product.prices.priceRange.min.currencyCode,
                                value: data.site.product.prices.priceRange.min.value
                            }
                        }
                    },
                    price_range: {
                        maximum_price: {
                            final_price: {
                                currency: data.site.product.prices.priceRange.max.currencyCode,
                                value: data.site.product.prices.priceRange.max.value
                            }
                        }
                    }
                }
            ],
            aggregations: data.site.product.productOptions.edges
                .map((aggregation: any) => {
                    if (aggregation?.node?.displayName !== undefined && aggregation?.node?.values?.edges !== undefined) {
                        return {
                            label: aggregation.node.displayName,
                            options: aggregation.node.values.edges
                                .filter((option: any) => option.node.isSelected)
                                .map((option: any) => ({
                                    label: option.node.label,
                                    value: option.node.entityId
                                }))
                        };
                    }
                    return null;
                })
                .filter((aggregation: any) => aggregation !== null)
        }
    };
}
